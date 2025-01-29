from dependencyinspection.commonpackages import get_popular_package_names
from dependencyinspection.config import dev_only
from dependencyinspection.data import bp
from dependencyinspection.models import PackageData
from dependencyinspection.utils import get_all_package_names

from . import database, scraper

# @bp.route("/deletePackages")
# async def delete_packages():
#     db_packages_delete_all()
#     return "success"

########################################################


@bp.route("/getDBPackages")
async def get_packages(package_names: list[str]) -> dict[str, PackageData]:
    dev_only()
    found: dict[str, PackageData] = database.db_search_packages(set(package_names))
    return found


@bp.route("/getDBPopularPackages")
async def get_popular_packages() -> dict[str, PackageData]:
    dev_only()
    to_search = get_popular_package_names()
    return await get_packages(list(to_search))


@bp.route("/getAllDBPackages")
async def get_all_packages() -> dict[str, PackageData]:
    dev_only()
    to_search = get_all_package_names()
    return await get_packages(list(to_search))


@bp.route("/getDBPackage")
async def get_package(package_name: str) -> dict[str, PackageData]:
    dev_only()
    return await get_packages(list(package_name))


########################################################
@bp.route("/scrapePackages")
async def scrape_packages(package_names: list[str]) -> str:
    dev_only()
    found = scraper.scrape_packages(set(package_names))
    return f"Successfully scraped {len(found)} packages.\n"


@bp.route("/scrapePopularPackages")
async def scrape_popular_packages() -> str:
    dev_only()
    to_search = get_popular_package_names()
    return await scrape_packages(list(to_search))


@bp.route("/scrapeAllPackages")
async def scrape_all_packages() -> str:
    dev_only()
    to_search = get_all_package_names(999)
    names_in_db = database.get_db_all_names()
    print("yes")
    filtered = list(filter(lambda item: item not in names_in_db, to_search))
    return await scrape_packages(list(filtered))


@bp.route("/scrapePackage/<package_name>")
async def scrape_package(package_name: str) -> str:
    dev_only()
    return await scrape_packages([package_name])
