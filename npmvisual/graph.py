import random
import json

import networkx as nx
from flask import Blueprint, jsonify

import npmvisual.utils as utils
from npmvisual._models.package import PackageData
from npmvisual.commonpackages import get_popular_package_names
from npmvisual.data import database, main

from .data_for_frontend import DataForFrontend, PackageDataAnalyzed

bp = Blueprint("network", __name__)


@bp.route("/getNetworks/<package_names>", methods=["GET"])
def get_networks(package_names: str):  # todo add type
    as_list = package_names.split(",")
    if not package_names:
        return jsonify({"error": "No package names provided"}), 400
    return _get_networks(as_list)


def _get_networks(
    package_names: list[str], max_count: int | utils.Infinity = utils.infinity
):
    max_count = 100
    print(f"Fetching network for packages: {package_names}")
    found: dict[str, PackageData] = main.search_and_scrape_recursive(
        set(package_names), max_count
    )
    print(f"Found: {len(found)} packages")
    formatted_data = format_for_frontend(found)
    return formatted_data


@bp.route("/getPopularNetworks", methods=["GET"])
def get_popular_networks():
    to_search = get_popular_package_names()
    return _get_networks(list(to_search), max_count=10000)


@bp.route("/getAllNetworks", methods=["GET"])
def get_all_networks():
    to_search = utils.get_all_package_names()
    return _get_networks(list(to_search))


@bp.route("/getAllDBNetworks", methods=["GET"])
def get_all_db_networks():
    print("Getting all nodes in the db")
    found = database.get_db_all()
    print(f"Got all nodes in the db: {len(found)} packages")

    formatted_data = format_for_frontend(found)
    print(f"Formatted graph data: {formatted_data}")
    return formatted_data


@bp.route("/getNetwork/<package_name>", methods=["GET"])
def get_network(package_name: str):
    return _get_networks([package_name])


@bp.route("/analyzeNetwork/<package_name>", methods=["GET"])
def analyze_network(package_name: str):
    try:
        response = _get_networks([package_name])
        graph_data = response.get_json()

        if not graph_data:
            return jsonify({"error": "No graph data provided"}), 400
        if "nodes" not in graph_data or "links" not in graph_data:
            return jsonify({"error": "Invalid graph structure"}), 400

        G = nx.DiGraph()
        for node in graph_data["nodes"]:
            G.add_node(node["id"])

        for link in graph_data["links"]:
            G.add_edge(link["source"], link["target"])

        degree_centrality = nx.degree_centrality(G)
        betweenness_centrality = nx.betweenness_centrality(
            G, normalized=True, endpoints=True
        )

        analysis_results = {
            "degree_centrality": degree_centrality,
            "betweenness_centrality": betweenness_centrality,
        }

        print("Analysis Results:", analysis_results)

        return jsonify(analysis_results), 200

    except Exception as e:
        print(f"Error processing the request for {package_name}: {str(e)}")
        return jsonify({"error": str(e)}), 500

def _create_nx_graph(data: dict[str, PackageDataAnalyzed]):
    G: nx.DiGraph = nx.DiGraph()
    # print(f"\n\nValues:{data.values()}")
    for p in data.values():
        if p.package_data is None:
            raise Exception("invalid PackgeData. Should not be None")
        # print(p)
        G.add_node(p.package_data.package.package_id)
        for d in p.package_data.dependencies:
            # G.add_edge(p.package.package_id, d.package_id)
            G.add_edge(p.package_data.package.package_id, d.package_id)
    return G


def format_as_nx(data: dict[str, PackageDataAnalyzed]) -> DataForFrontend:
    """
    Converts the given package data into a NetworkX graph and formats it into a structure
    with in-degrees and colors based on SCCs.

    Args:
        data: A dictionary of Package objects where the key is the package ID and the
        value is the Package.

    Returns:
        A dictionary in the node-link format with additional 'inDegree', 'val', and
        'color' properties for each node.
    """
    G = _create_nx_graph(data)
        # Prepare the graph data in node-link format
    print(f"data: {data}")
    multigraph = G.is_multigraph()
    if multigraph:
        edges = [
            {**d, "source": u, "target": v, "key": k}
            for u, v, k, d in G.edges(keys=True, data=True)
        ]
    else:
        edges = [{**d, "source": u, "target": v} for u, v, d in G.edges(data=True)]

    nodes: list[PackageDataAnalyzed] = list(data.values())
    graph_data = DataForFrontend(
        links = edges,
        nodes = nodes,
        multigraph = multigraph,
        graph = G.graph,
        directed = True
    )
    _set_out_degree(graph_data, G)
    _set_in_degree(graph_data, G)
    _set_betweenness_centrality(graph_data, G)
    _set_val(graph_data)
    _color_nodes(graph_data, G)
    _remove_unwanted_data(graph_data)
    return graph_data

def _remove_unwanted_data(graph_data: DataForFrontend):
    for node in graph_data.nodes:
        node.package_data = None


def _set_val(graph_data: DataForFrontend):
    # Set the base size multiplier (you can adjust this to control overall size)
    size_exponent = 1.15
    size_multiplier = 4  # Adjust this to fine-tune node size scaling

    # Loop over nodes and apply stronger exponential scaling
    
    for node in graph_data.nodes: 
        # Apply stronger exponential scaling
        if node.out_degree is None:
            raise Exception(f"node has no in degree to convert to val: {node}")
        node.val = (
            (node.out_degree + 1)**size_exponent
        ) * size_multiplier  # Apply quadratic scaling

    return graph_data  # pyright: ignore[reportUnknownVariableType]

def _set_betweenness_centrality(graph_data: DataForFrontend, G):
    betweenness_centrality = nx.betweenness_centrality(G, normalized=True, endpoints=False)
    print(betweenness_centrality)
    for node in graph_data.nodes: 
        node.betweenness_centrality = betweenness_centrality[node.id]
    return graph_data

def _set_in_degree(graph_data: DataForFrontend, G):
    in_degrees: dict[str, int] = dict(G.in_degree())
    for node in graph_data.nodes: 
        node.in_degree = in_degrees[node.id]
    return graph_data  

def _set_out_degree(graph_data: DataForFrontend, G):
    out_degrees: dict[str, int] = dict(G.out_degree())
    for node in graph_data.nodes: 
        node.out_degree = out_degrees[node.id]
    return graph_data 


def _color_nodes(graph_data: DataForFrontend, G):
    undirected = G.copy().to_undirected()
    communities = nx.community.louvain_communities(undirected)
    node_colors = {}
    default_color = _get_random_color()
    for _, community in enumerate(communities):
        # print(f"Community {i+1}: {community}")
        if len(community) > 1:
            color = _get_random_color()
            for community_id, node in enumerate(community):
                node_colors[node] = (color, community_id)
        else:
            for node in community:
                node_colors[node] = (default_color, -1)

    # print(f"graph_data: {graph_data}")
    for node in graph_data.nodes:
        node.color = node_colors[node.id][0]
        node.color_id = node_colors[node.id][1]
    return graph_data


def _get_random_color():
    """Generates a random color in hex format."""
    return f"#{random.randint(0, 255):02x}{random.randint(0, 255):02x}{random.randint(0, 255):02x}"


def format_for_frontend(data: dict[str, PackageData]):
    # print(f"data: {data}")
    data_with_analysis = PackageDataAnalyzed.from_package_data(data)
    data_for_frontend: DataForFrontend = format_as_nx(data_with_analysis)
    # print(f"\n\nnx_graph: {nx_graph}")
    serialized_data_for_frontend = data_for_frontend.to_dict()
    x = jsonify(serialized_data_for_frontend)
    print(json.dumps(serialized_data_for_frontend))
    return x    
