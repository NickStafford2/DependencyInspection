from dependencyinspection.commonpackages import get_popular_package_names
from dependencyinspection.data import bp
from dependencyinspection.models import PackageData
from dependencyinspection.utils import get_all_package_names

from . import database, scraper

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
    found: dict[str, PackageData] = database.db_search_packages(set(package_names))
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
    found = scraper.scrape_packages(set(package_names))
    return f"Successfully scraped {len(found)} packages.\n"


@bp.route("/scrapePopularPackages")
def scrape_popular_packages() -> str:
    to_search = get_popular_package_names()
    return scrape_packages(list(to_search))


@bp.route("/scrapeAllPackages")
def scrape_all_packages() -> str:
    to_search = get_all_package_names(999)
    names_in_db = database.get_db_all_names()
    print("yes")
    filtered = list(filter(lambda item: item not in names_in_db, to_search))
    return scrape_packages(list(filtered))


@bp.route("/scrapePackage/<package_name>")
def scrape_package(package_name: str) -> str:
    return scrape_packages([package_name])
