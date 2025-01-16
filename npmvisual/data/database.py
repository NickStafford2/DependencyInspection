from neomodel import db

import dependencyinspection.utils as utils
from dependencyinspection.models import Dependency, Package, PackageData


def get_db_all_names() -> list[str]:
    query = "MATCH (p:Package) RETURN p.package_id"
    results, _ = db.cypher_query(query)
    return results[0]


def get_db_all() -> dict[str, PackageData]:
    found: dict[str, PackageData] = {}
    packages = Package.nodes.all()
    for package in packages:
        found[package.package_id] = PackageData(package, [])
    return _packages_to_package_data(packages)


def save_packages(packages: set[Package]):
    for p in packages:
        p.save()


def search_db_recursive(
    to_search: set[str],
    all_found: dict[str, PackageData],
    package_count_limit: int | None,
    depth: int = 0,
) -> tuple[dict[str, PackageData], set[str]]:
    utils.nsprint(f"search_db_recursive(to_search: {to_search})", 2)
    to_search = to_search.copy()
    found: dict[str, PackageData] = {}
    not_in_db: set[str] = set()
    while len(to_search) > 0:
        newly_found: dict[str, PackageData] = db_search_packages(to_search)
        not_found = to_search - set(newly_found.keys())
        not_in_db.update(not_found)
        found.update(newly_found)
        to_search = set()
        for package_data in newly_found.values():
            for dependency in package_data.dependencies:
                id = dependency.package_id
                if id not in not_in_db and id not in found and id not in all_found:
                    # utils.nsprint(f"added dependency:{id}", 3)
                    to_search.add(id)
    return (found, not_in_db)


def db_search_packages(package_names: set[str]) -> dict[str, PackageData]:
    """
    Retrieves a list of packages and their dependencies.
    """
    utils.nsprint(f"db_search_packages({package_names})", 3)
    packages = Package.nodes.filter(package_id__in=list(package_names))
    return _packages_to_package_data(packages)


def _packages_to_package_data(packages: list[Package]) -> dict[str, PackageData]:
    found: dict[str, PackageData] = {}
    package_names = set()
    for package in packages:
        found[package.package_id] = PackageData(package, [])
        package_names.add(package.package_id)
    # Cypher query to fetch dependencies and their version
    query = """
    MATCH (p:Package)-[r:DEPENDS_ON]->(dep:Package)
    WHERE p.package_id IN $package_names
    RETURN p.package_id as package_id, 
        COLLECT({
            dep_package_id: dep.package_id, 
            dep_version: r.version
        }) as dependencies
    """
    results: list[tuple[str, list[dict[str, str]]]]
    results, meta = db.cypher_query(query, {"package_names": list(package_names)})  # type: ignore
    # print()
    # print(meta)
    for result in results:
        package_id: str = result[0]
        db_dependencies: dict[str, str] = result[1]  # type: ignore
        # utils.nsprint(f"package_id: {str(package_id)}", 4)
        dep_list: list[Dependency] = []
        for row in db_dependencies:
            # utils.nsprint(f"row: {str(row)}", 4)
            dep_list.append(Dependency(row["dep_package_id"], row["dep_version"]))  # type: ignore
        found[package_id].dependencies = dep_list
    return found
