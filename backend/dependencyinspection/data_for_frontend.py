from dataclasses import dataclass
from typing import Any

from dependencyinspection._models.dependency import Dependency
from dependencyinspection._models.package import PackageData


@dataclass
class DependencyFrontend:
    packageId: str
    version: str


@dataclass
class PackageDataAnalyzed:
    id: str
    package_data: PackageData | None
    val: float | None
    dependencies: list[Dependency] | None = None
    dependency_of: list[str] | None = None
    all_dependencies: list[str] | None = None
    all_dependency_of: list[str] | None = None
    betweenness_centrality: float | None = None
    closeness_centrality: float | None = None
    eigenvector_centrality: float | None = None
    clustering_coefficient: float | None = None
    pagerank: float | None = None
    is_seed: bool | None = None
    in_degree: int | None = None
    out_degree: int | None = None
    color: str | None = None
    color_id: int | None = None

    @classmethod
    def from_package_data(
        cls, data: dict[str, PackageData]
    ) -> dict[str, "PackageDataAnalyzed"]:
        results: dict[str, PackageDataAnalyzed] = {}
        for package_name, pd in data.items():
            results[package_name] = PackageDataAnalyzed(
                id=package_name, package_data=pd, val=-1
            )
        return results

    def to_dict(self) -> dict[str, Any]:
        # Convert the PackageDataAnalyzed object to a dictionary
        return {
            "id": self.id,
            "packageData": None,
            "val": self.val,
            "isSeed": self.is_seed,
            "inDegree": self.in_degree,
            "dependencies": (
                sorted(
                    [
                        DependencyFrontend(dep.package_id, dep.version)
                        for dep in self.package_data.dependencies
                    ],
                    key=lambda dep: dep.packageId,
                )
                if self.package_data
                else None
            ),
            "dependencyOf": self.dependency_of,
            "allDependencies": self.all_dependencies,
            "allDependencyOf": self.all_dependency_of,
            "betweennessCentrality": self.betweenness_centrality,
            "closenessCentrality": self.closeness_centrality,
            "eigenvectorCentrality": self.eigenvector_centrality,
            "pagerank": self.pagerank,
            "clusteringCoefficient": self.clustering_coefficient,
            "outDegree": self.out_degree,
            "color": self.color,
            "colorId": self.color_id,
        }


@dataclass
class Edge:
    index: int
    source: Any
    target: Any


@dataclass
class DataForFrontend:
    links: list[Any]
    nodes: list[PackageDataAnalyzed]
    graph: dict
    multigraph: bool
    directed: bool

    def to_dict(self) -> dict[str, Any]:
        # Serialize the DataForFrontend object, including converting each node with to_dict()
        return {
            "links": self.links,  # Assuming this is already in the correct format
            "nodes": [
                node.to_dict() for node in self.nodes
            ],  # Call `to_dict` for each node
            "graph": self.graph,  # Assuming this is already in the correct format
            "multigraph": self.multigraph,
            "directed": self.directed,
        }
