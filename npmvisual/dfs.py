from collections import defaultdict

import networkx as nx


def all_successors(G: nx.DiGraph):
    def dfs(current: str):
        visited.add(current)
        children = list(G.neighbors(current))
        successors[current].update(children)
        for child in children:
            if child not in visited:
                dfs(child)
            successors[current].update(successors[child])
        finished.add(current)

    successors = defaultdict(set)
    visited = set()
    finished = set()
    for node in G:
        dfs(node)
    return successors


def all_predecessors(G: nx.DiGraph):
    def dfs(current: str):
        visited.add(current)
        predecessors = list(G.predecessors(current))
        all_predecessors[current].update(predecessors)
        for pred in predecessors:
            if pred not in visited:
                dfs(pred)
            all_predecessors[current].update(all_predecessors[pred])
        finished.add(current)

    all_predecessors = defaultdict(set)
    visited = set()
    finished = set()
    for node in G:
        dfs(node)
    return all_predecessors
