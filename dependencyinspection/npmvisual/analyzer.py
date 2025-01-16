import networkx as nx
import os
from colorama import Fore, Style, init
from collections import OrderedDict
import numpy as np

# Initialize colorama
init(autoreset=True)
indent = "    "


def analyze(graph):

    # Title of the analysis in yellow
    print(Fore.YELLOW + "--- Graph Analysis ---" + Style.RESET_ALL + "\n")

    # 1. Basic Graph Information with colored sections
    print(Fore.YELLOW + "Graph Information:" + Style.RESET_ALL)
    print(
        f"{indent}{Fore.GREEN}Number of nodes:{Style.RESET_ALL} {Fore.CYAN}{graph.number_of_nodes()}{Style.RESET_ALL}"
    )
    print(
        f"{indent}{Fore.GREEN}Number of edges:{Style.RESET_ALL} {Fore.CYAN}{graph.number_of_edges()}{Style.RESET_ALL}"
    )
    print(
        f"{indent}{Fore.GREEN}Is directed?:{Style.RESET_ALL} {Fore.CYAN}{graph.is_directed()}{Style.RESET_ALL}"
    )

    # 2. Degree Centrality (already existing)
    analyze_degree_centrality(graph)

    # 3. Closeness Centrality (already existing)
    analyze_closeness_centrality(graph)

    # 4. Betweenness Centrality (already existing)
    analyze_betweenness_centrality(graph)

    # 5. Shortest Path (already existing)
    analyze_shortest_paths(graph)

    # 6. Strongly Connected Components (already existing)
    analyze_strongly_connected_components(graph)

    # 7. Community Detection (already existing)
    # analyze_community_detection(graph)

    # 8. Clique Detection (already existing)
    # analyze_cliques(graph)

    # 9. Graph Density (already existing)
    analyze_graph_density(graph)

    # New Analysis Functions
    analyze_pagerank(graph)
    analyze_hits(graph)
    analyze_weakly_connected_components(graph)
    analyze_diameter_and_radius(graph)
    analyze_degree_distribution(graph)
    analyze_transitivity(graph)
    # analyze_rich_club(graph)
    analyze_edge_betweenness(graph)
    analyze_k_core(graph)

    print("\nAnalysis Complete")


# Function to analyze Degree Centrality
def analyze_degree_centrality(graph):
    print(Fore.YELLOW + "\nDegree Centrality (Top 5 nodes)")
    degree_centrality = nx.degree_centrality(graph)
    sorted_degree = sorted(
        degree_centrality.items(), key=lambda item: item[1], reverse=True
    )

    for node, centrality in sorted_degree[:5]:
        print(
            f"{indent}{Fore.GREEN}{node:<25}{Style.RESET_ALL}: {Fore.CYAN}{centrality:.4f}{Style.RESET_ALL}"
        )


# Function to analyze Closeness Centrality
def analyze_closeness_centrality(graph):
    print(Fore.YELLOW + "\nCloseness Centrality (Top 5 nodes)")
    closeness_centrality = nx.closeness_centrality(graph)
    sorted_closeness = sorted(
        closeness_centrality.items(), key=lambda item: item[1], reverse=True
    )

    for node, centrality in sorted_closeness[:5]:
        print(
            f"{indent}{Fore.GREEN}{node:<25}{Style.RESET_ALL}: {Fore.CYAN}{centrality:.4f}{Style.RESET_ALL}"
        )


# Function to analyze Betweenness Centrality
def analyze_betweenness_centrality(graph):
    print(Fore.YELLOW + "\nBetweenness Centrality (Top 5 nodes)")
    betweenness_centrality = nx.betweenness_centrality(graph)
    sorted_betweenness = sorted(
        betweenness_centrality.items(), key=lambda item: item[1], reverse=True
    )

    for node, centrality in sorted_betweenness[:5]:
        print(
            f"{indent}{Fore.GREEN}{node:<25}{Style.RESET_ALL}: {Fore.CYAN}{centrality:.4f}{Style.RESET_ALL}"
        )


def analyze_shortest_paths(graph):
    seed = "npm"
    print(Fore.YELLOW + f"\nShortest Paths (from 'react'): " + Style.RESET_ALL)
    if seed in graph:
        shortest_paths = nx.single_source_shortest_path_length(graph, seed)
        for target, length in sorted(shortest_paths.items(), key=lambda item: item[1]):
            print(
                f"{indent}{Fore.GREEN}{seed}{Style.RESET_ALL} -> {Fore.CYAN}{target}{Style.RESET_ALL}: {Fore.MAGENTA}{length}{Style.RESET_ALL}"
            )
    else:
        print(f"{indent}{Fore.RED}Node {seed} not found in the graph{Style.RESET_ALL}")


def analyze_strongly_connected_components(graph):
    print(Fore.YELLOW + f"\nStrongly Connected Components (SCC):" + Style.RESET_ALL)
    scc = list(nx.strongly_connected_components(graph))
    for i, component in enumerate(scc[:5]):
        print(
            f"{indent}{Fore.GREEN}Component {i+1}:{Style.RESET_ALL} {Fore.CYAN}{sorted(component)}{Style.RESET_ALL}"
        )


def analyze_community_detection(graph):
    try:
        from community import community_louvain

        print(
            Fore.YELLOW
            + f"\n{indent}Community Detection (Top 5 communities):"
            + Style.RESET_ALL
        )
        partition = community_louvain.best_partition(graph)
        communities = {}
        for node, community_id in partition.items():
            if community_id not in communities:
                communities[community_id] = []
            communities[community_id].append(node)
        for i, community_nodes in enumerate(list(communities.values())[:5]):
            print(
                f"{indent}{Fore.GREEN}Community {i+1}:{Style.RESET_ALL} {Fore.CYAN}{sorted(community_nodes)}{Style.RESET_ALL}"
            )
    except ImportError:
        print(
            f"{indent}{Fore.RED}\nCommunity Detection (Louvain) requires 'python-louvain' package. Skipping.{Style.RESET_ALL}"
        )


def analyze_cliques(graph):
    print("\nCliques in the graph:")
    cliques = list(nx.find_cliques(graph))
    for i, clique in enumerate(cliques[:5]):
        print(f"{indent}Clique {i + 1}: {sorted(clique)}")


def analyze_graph_density(graph):
    print(
        Fore.YELLOW
        + f"\nGraph Density: {Fore.CYAN}{nx.density(graph):.4f}"
        + Style.RESET_ALL
    )


def analyze_pagerank(graph):
    print(Fore.YELLOW + "\nPageRank (Top 5 nodes):" + Style.RESET_ALL)
    pagerank = nx.pagerank(graph)
    sorted_pagerank = sorted(pagerank.items(), key=lambda item: item[1], reverse=True)
    for node, rank in sorted_pagerank[:5]:
        print(
            f"{indent}{Fore.GREEN}{node:<20}:{Style.RESET_ALL} {Fore.CYAN}{rank:.4f}{Style.RESET_ALL}"
        )


def analyze_hits(graph):
    print(
        Fore.YELLOW + "\nHITS Algorithm (Top 5 Hubs and Authorities):" + Style.RESET_ALL
    )
    hubs, authorities = nx.hits(graph)
    sorted_hubs = sorted(hubs.items(), key=lambda item: item[1], reverse=True)
    sorted_authorities = sorted(
        authorities.items(), key=lambda item: item[1], reverse=True
    )

    print(Fore.CYAN + "\nTop Hubs:" + Style.RESET_ALL)
    for node, hub_score in sorted_hubs[:5]:
        print(
            f"{indent}{Fore.GREEN}{node:<20}:{Style.RESET_ALL} {Fore.CYAN}{hub_score:.4f}{Style.RESET_ALL}"
        )

    print(Fore.CYAN + "\nTop Authorities:" + Style.RESET_ALL)
    for node, authority_score in sorted_authorities[:5]:
        print(
            f"{indent}{Fore.GREEN}{node:<20}:{Style.RESET_ALL} {Fore.CYAN}{authority_score:.4f}{Style.RESET_ALL}"
        )


def analyze_weakly_connected_components(graph, indent="    "):
    terminal_width = os.get_terminal_size().columns  # Get terminal width
    print(Fore.YELLOW + "\nWeakly Connected Components (Top 5):" + Style.RESET_ALL)

    weakly_connected_components = list(nx.weakly_connected_components(graph))

    # Limit to the top 5 components for brevity
    for i, component in enumerate(weakly_connected_components[:5]):
        # Format the component header with a green label
        print(f"{indent}{Fore.GREEN}Component {i+1}:{Style.RESET_ALL}")

        # Sort the nodes in the component for consistency and easy reading
        sorted_component = sorted(component)

        # Print the nodes in chunks
        chunk_size = 10
        for j in range(0, len(sorted_component), chunk_size):
            chunk = sorted_component[j : j + chunk_size]
            chunk_str = str(chunk)  # Convert list to string
            # If the line is too long, truncate and add ellipsis
            if len(chunk_str) > terminal_width:
                chunk_str = chunk_str[: terminal_width - 13] + "..."
            print(f"{indent}{Fore.CYAN}{chunk_str}{Style.RESET_ALL}")


def analyze_diameter_and_radius(graph):
    print(Fore.YELLOW + "\nGraph Diameter and Radius:" + Style.RESET_ALL)
    if nx.is_strongly_connected(graph):
        eccentricities = nx.eccentricity(graph)
        diameter = max(eccentricities.values())
        radius = min(eccentricities.values())
        print(f"{Fore.CYAN}Graph Diameter: {diameter}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Graph Radius: {radius}{Style.RESET_ALL}")
    else:
        print(
            f"{indent}"
            + Fore.RED
            + "Graph is not strongly connected. Skipping diameter and radius."
            + Style.RESET_ALL
        )


def analyze_degree_distribution(graph):
    print(Fore.YELLOW + "\nIn-Degree and Out-Degree Distribution:" + Style.RESET_ALL)
    in_degrees = dict(graph.in_degree())
    out_degrees = dict(graph.out_degree())

    sorted_in_degrees = sorted(
        in_degrees.items(), key=lambda item: item[1], reverse=True
    )
    sorted_out_degrees = sorted(
        out_degrees.items(), key=lambda item: item[1], reverse=True
    )

    print(Fore.CYAN + "\nTop 5 Nodes by In-Degree:" + Style.RESET_ALL)
    for node, degree in sorted_in_degrees[:5]:
        print(f"{indent}{Fore.GREEN}{node:<20}: {degree}{Style.RESET_ALL}")

    print(Fore.CYAN + "\nTop 5 Nodes by Out-Degree:" + Style.RESET_ALL)
    for node, degree in sorted_out_degrees[:5]:
        print(f"{indent}{Fore.GREEN}{node:<20}: {degree}{Style.RESET_ALL}")


def analyze_transitivity(graph):
    print(Fore.YELLOW + "\nGraph Transitivity:" + Style.RESET_ALL)
    transitivity = nx.transitivity(graph)
    print(f"{indent}{Fore.CYAN}Transitivity: {transitivity:.4f}{Style.RESET_ALL}")


def analyze_rich_club(graph):
    print("\nRich-Club Coefficient:")
    rich_club = nx.rich_club_coefficient(graph)
    for degree, coefficient in rich_club.items():
        print(f"Degree {degree}: Rich-club coefficient: {coefficient:.4f}")


def analyze_edge_betweenness(graph):
    print(
        Fore.YELLOW + "\nEdge Betweenness Centrality (Top 5 edges):" + Style.RESET_ALL
    )
    edge_betweenness = nx.edge_betweenness_centrality(graph)
    sorted_edge_betweenness = sorted(
        edge_betweenness.items(), key=lambda item: item[1], reverse=True
    )
    for edge, centrality in sorted_edge_betweenness[:5]:
        print(
            f"    {Fore.GREEN}Edge {edge}:{Style.RESET_ALL} {Fore.CYAN}{centrality:.4f}{Style.RESET_ALL}"
        )


def analyze_k_core(graph, k=3, indent="    "):
    try:
        terminal_width = os.get_terminal_size().columns  # Get terminal width
        print(Fore.YELLOW + f"\nK-Core Decomposition (k={k}):" + Style.RESET_ALL)
        k_core = nx.k_core(graph, k=k)
        nodes = sorted(k_core.nodes())

        # Print nodes in chunks
        chunk_size = 10
        for j in range(0, len(nodes), chunk_size):
            chunk = nodes[j : j + chunk_size]
            chunk_str = str(chunk)  # Convert list to string
            # If the line is too long, truncate and add ellipsis
            if len(chunk_str) > terminal_width:
                chunk_str = chunk_str[: terminal_width - 23] + "..."
            print(
                f"{indent}{Fore.GREEN}K-Core (k={k}) nodes:{Style.RESET_ALL} {Fore.CYAN}{chunk_str}{Style.RESET_ALL}"
            )
    except Exception as e:
        pass
