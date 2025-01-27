import asyncio
import logging
import random

import networkx as nx
from quart import Blueprint, Response, abort, jsonify, make_response, request, json

import dependencyinspection.utils as utils
from dependencyinspection._models.package import PackageData
from dependencyinspection.commonpackages import get_popular_package_names
from dependencyinspection.data import database, main
from dependencyinspection.server_sent_event import ServerSentEvent

from . import dfs
from .data_for_frontend import DataForFrontend, PackageDataAnalyzed

bp = Blueprint("network", __name__)


@bp.get("/sse")
async def sse():
    if "text/event-stream" not in request.accept_mimetypes:
        abort(400)

    async def send_events():
        data = "tesing1"
        event = ServerSentEvent(data, "message")
        yield event.encode()
        data = "tesing2"
        event = ServerSentEvent(data, "message")
        yield event.encode()
        data = "done"
        event = ServerSentEvent(data, "message")
        yield event.encode()

    response = await make_response(
        send_events(),
        {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Transfer-Encoding": "chunked",
        },
    )
    response.timeout = None
    return response


@bp.route("/getNetworks/<package_names>", methods=["GET"])
async def get_networks(package_names: str) -> Response:
    logging.warning("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHH. ")

    async def send_events():
        hello = ServerSentEvent("just saying hi", "message", "request_recieved")
        yield hello.encode()
        # as_list = package_names.split(",")
        # list_msg = ServerSentEvent(as_list, "message", "starting_search")
        # yield list_msg.encode()
        # if not package_names:
        #     error_message = ServerSentEvent(
        #         {"error": "No package names provided"}, "message", "no_package_error"
        #     )
        #     yield error_message.encode()
        #     # yield jsonify()
        # else:
        #     networks = _get_networks(as_list)
        #     networkEvent = ServerSentEvent(networks, "message", "network")
        #     yield networkEvent.encode()

    response = await make_response(
        send_events(),
        {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Transfer-Encoding": "chunked",
        },
    )

    response.timeout = None
    return response


def _get_networks(package_names: list[str], max_count: int = 99999999):
    max_count = 100
    # print(f"Fetching network for packages: {package_names}")
    found: dict[str, PackageData] = main.search_and_scrape_recursive(
        set(package_names), max_count
    )
    # print(f"Found: {len(found)} packages")
    formatted_data = format_for_frontend(set(package_names), found)
    return formatted_data


@bp.route("/getPopularNetworks", methods=["GET"])
async def get_popular_networks():
    to_search = get_popular_package_names()
    return _get_networks(list(to_search), max_count=10000)


@bp.route("/getAllNetworks", methods=["GET"])
async def get_all_networks():
    to_search = utils.get_all_package_names()
    return _get_networks(list(to_search))


@bp.route("/getAllDBNetworks", methods=["GET"])
async def get_all_db_networks():
    logging.warning("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHH22222. ")
    # print("Getting all nodes in the db")
    found = database.get_db_all()
    # print(f"Got all nodes in the db: {len(found)} packages")

    formatted_data = format_for_frontend(set(found.keys()), found)
    # print(f"Formatted graph data: {formatted_data}")
    return formatted_data


@bp.route("/getNetwork/<package_name>", methods=["GET"])
async def get_network(package_name: str):
    return _get_networks([package_name])


@bp.route("/analyzeNetwork/<package_name>", methods=["GET"])
async def analyze_network(package_name: str):
    try:
        response = _get_networks([package_name])
        graph_data = await response.get_json()

        if not graph_data:
            return jsonify({"error": "No graph data provided"})
        if "nodes" not in graph_data or "links" not in graph_data:
            return jsonify({"error": "Invalid graph structure"})

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

        # print("Analysis Results:", analysis_results)

        return jsonify(analysis_results), 200

    except Exception as e:
        # print(f"Error processing the request for {package_name}: {str(e)}")
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


def format_as_nx(
    seed_nodes: set[str], data: dict[str, PackageDataAnalyzed]
) -> DataForFrontend:
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
    # print(f"data: {data}")
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
        links=edges, nodes=nodes, multigraph=multigraph, graph=G.graph, directed=True
    )
    _set_indirect_relationships(graph_data, G)
    _set_direct_relationships(graph_data, G)
    _set_in_degree(graph_data, G)
    _set_out_degree(graph_data, G)
    _set_graph_metrics(graph_data, G)
    _set_val(graph_data)
    _color_nodes(graph_data, G)
    _set_seed_nodes(graph_data, seed_nodes)
    _remove_unwanted_data(graph_data)
    return graph_data


def _set_direct_relationships(graph_data: DataForFrontend, G: nx.DiGraph):
    for node in graph_data.nodes:
        node.dependency_of = list(G.predecessors(node.id))
        # node.dependency = list(G.predecessors(node))


def _set_indirect_relationships(graph_data: DataForFrontend, G: nx.DiGraph):
    all_dependencies = dfs.all_successors(G)
    all_depends_on = dfs.all_predecessors(G)
    for node in graph_data.nodes:
        node.all_dependencies = list(all_dependencies.get(node.id, []))
        # print(node.all_dependencies)
        node.all_dependency_of = list(all_depends_on.get(node.id, []))


def _set_seed_nodes(graph_data: DataForFrontend, seed_nodes: set[str]):
    for node in graph_data.nodes:
        node.is_seed = node.id in seed_nodes


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
            (node.out_degree + 1) ** size_exponent
        ) * size_multiplier  # Apply quadratic scaling

    return graph_data  # pyright: ignore[reportUnknownVariableType]


def _set_graph_metrics(graph_data: DataForFrontend, G):
    # Calculate various centrality measures and metrics
    betweenness_centrality = nx.betweenness_centrality(
        G, normalized=True, endpoints=False
    )
    closeness_centrality = nx.closeness_centrality(G)
    normalization = max(1, len(G.nodes) - 1)
    normalized_closeness_centrality = {
        node_id: value / normalization  # Normalize by the maximum possible value
        for node_id, value in closeness_centrality.items()
    }
    eigenvector_centrality = nx.eigenvector_centrality(G, max_iter=1000, tol=1e-4)
    pagerank = nx.pagerank(G)
    clustering_coefficient = nx.clustering(G)

    # Assign the calculated metrics to nodes
    for node in graph_data.nodes:
        node.betweenness_centrality = betweenness_centrality[node.id]
        node.closeness_centrality = normalized_closeness_centrality[node.id]
        node.eigenvector_centrality = eigenvector_centrality[node.id]
        node.pagerank = pagerank[node.id]
        node.clustering_coefficient = clustering_coefficient[node.id]
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


def format_for_frontend(seed_nodes: set[str], data: dict[str, PackageData]):
    # print(f"data: {data}")
    data_with_analysis = PackageDataAnalyzed.from_package_data(data)
    data_for_frontend: DataForFrontend = format_as_nx(seed_nodes, data_with_analysis)
    # print(f"\n\nnx_graph: {nx_graph}")
    serialized_data_for_frontend = data_for_frontend.to_dict()
    x = json.dumps(serialized_data_for_frontend)
    # print(json.dumps(serialized_data_for_frontend))
    return x
