import logging
from typing import Any

import requests
from quart import current_app as app

import dependencyinspection.utils as utils
from dependencyinspection.models import Package, PackageData, Packument

# I will set this up soon. Need some way to test it. I can probably just call a fake
# server and log the errors.
# # Setup retry strategy in case they dislike the spam of requests
# retry_strategy = Retry(
#   total=3,  # Total number of retries
#   status_forcelist=[429, 500, 502, 503, 504],  # Status codes to retry for
#   allowed_methods=["GET", "POST"],  # HTTP methods to retry
#   backoff_factor=1  # Backoff time between retries
# )
#
# adapter = HTTPAdapter(max_retries=retry_strategy)
# http = requests.Session()
# # Mount the adapter to the session for all HTTP and HTTPS requests
# http.mount("https://", adapter)
# http.mount("http://", adapter)


def scrape_packages(
    to_search: set[str],
) -> dict[str, PackageData]:
    utils.nsprint(f"scrape_packages: scraping: {to_search}", 2)
    found: dict[str, PackageData] = {}
    for id in to_search:
        scraped: PackageData | None = scrape_package(id)
        if not scraped:
            utils.nsprint(f"could not scrape: {id}", 3)
            # todo: try to scrape again if it fails
            scraped = Package.create_placeholder(id)
            scraped.package.save()
        found[id] = scraped
    utils.nsprint(f"scrape_packages: found: {found.keys()}", 2)
    return found


def scrape_package(package_name: str) -> PackageData | None:
    # utils.nsprint("scrape_package()", 3)
    # try:
    json_dict = None
    count = 0
    try:
        while not json_dict and count < 3:
            json_dict = scrape_package_json(package_name)
            count += 1
        if not json_dict:
            logging.error(f"Failed to scrape package JSON for package: {package_name}")
            return None
        # _print_json_var(json_dict)
        packument = Packument.from_json(json_dict)
        if not packument:
            raise Exception(
                "packument does not parse properly. fix this. This is unexpected."
            )
            logging.error(
                f"Failed to convert scraped JSON to Packument for package: {package_name}"
            )
            return None
        packageData: PackageData = Package.from_packument(packument)
        if not packageData.package:
            logging.error(
                f"Failed to create Package object from Packument for package: {package_name}"
            )
            return None
        packageData.package.save()
        return packageData
    except Exception as _:
        return None


def scrape_package_json(package_name: str) -> dict[str, Any] | None:
    """
    Scrapes the package.json of a given npm package and returns the JSON content as a dictionary.

    :param package_name: The name of the package to scrape.
    :return: A dictionary representing the package.json or None in case of an error.
    """
    # print(f"scraping package named {name}")
    url = f"https://registry.npmjs.org/{package_name}"
    # app.logger.info(f"scraping package.json from {url}")
    utils.nsprint(f"scraping package.json from {url}", 4)

    try:
        response = requests.get(url)
        # Raise an exception for HTTP error codes
        response.raise_for_status()  # request raise for status
        r_dict = response.json()
        return r_dict
    except requests.exceptions.HTTPError as e:
        # app.logger.error(e)
        print(f"HTTP error: {e}")
        if e.response.status_code == 401:
            print("Authentication required.")
        elif e.response.status_code == 403:
            print("Access denied.")
        elif e.response.status_code == 404:
            print("Resource not found.")
        elif e.response.status_code == 429:
            print("Too Many Requests.")
        elif e.response.status_code == 500:
            print("Server error.")

    except requests.exceptions.ConnectionError:
        print("Connection error.")
    except requests.exceptions.Timeout:
        print("Request timed out.")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

    return None
