from npmvisual._models.package import Package, PackageData
from npmvisual.commonpackages import get_popular_package_names
from npmvisual.data import bp
from npmvisual.utils import get_all_package_names

from .main import (
    scrape_packages as db_scrape_packages,
)
from . import database

# @bp.route("/deletePackages")
# def delete_packages():
#     db_packages_delete_all()
#     return "success"

########################################################


@bp.route("/test")
def test():
    print("success")
    return "success"


@bp.route("/getDBPackages")
def get_packages(package_names: list[str]) -> dict[str, PackageData]:
    found: dict[str, PackageData]
    (found, not_found) = db.db_search_packages(set(package_names))
    return found


@bp.route("/getDBPopularPackages")
def get_popular_packages() -> dict[str, PackageData]:
    to_search = get_popular_package_names()
    return get_packages(list(to_search))


@bp.route("/getAllDBPackages")
def get_all_packages() -> dict[str, PackageData]:
    to_search = get_all_package_names()
    return get_packages(list(to_search))


@bp.route("/getDBPackage")
def get_package(package_name: str) -> dict[str, PackageData]:
    return get_packages(list(package_name))


########################################################
@bp.route("/scrapePackages")
def scrape_packages(package_names: list[str]) -> str:
    (found, not_found) = db_scrape_packages(set(package_names))
    return (
        f"Successfully scraped {len(found)} packages.\n"
        f"Failed to scrape {len(not_found)} packages."
    )


@bp.route("/scrapePopularPackages")
def scrape_popular_packages() -> str:
    to_search = get_popular_package_names()
    return scrape_packages(list(to_search))


@bp.route("/scrapeAllPackages")
def scrape_all_packages() -> str:
    to_search = get_all_package_names(999)
    names_in_db = db.get_db_all_names()
    print("yes")
    filtered = list(filter(lambda item: item not in names_in_db, to_search))
    return scrape_packages(list(filtered))


@bp.route("/scrapePackage/<package_name>")
def scrape_package(package_name: str) -> str:
    return scrape_packages([package_name])
