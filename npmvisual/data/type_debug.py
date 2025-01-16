from time import sleep
from npmvisual.data import bp

from .type_analyzer import NSType, NSTypeDB
from . import cache


@bp.route("/searchCachePackages")
def search_cached_files(max: int = 500):
    filenames = cache.get_random_filenames(
        max
    )  # This function retrieves all file names
    for filename in filenames:
        json_data = cache.load_cache_file(filename)
        NSType(json_data)
    NSTypeDB.print()
    sleep(20)
    return "success"
