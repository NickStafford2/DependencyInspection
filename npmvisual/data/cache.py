"""We are no longer using this. This will likely be deleted if I can not find a reason to 
keep it around. 

IDEA: use this for testing. """

import os
import random
import shutil
import string
from pathlib import Path
from typing import Any

from flask import current_app as app
from flask import json

from dependencyinspection.utils import ns_hash

whitelist = set(string.ascii_letters + string.digits)
_HASH_LENGTH = 40


def _get_cache_path() -> str:
    dir_path = os.path.dirname(os.path.realpath(__file__))
    return os.path.join(dir_path + "/package_cache")


cache_path = _get_cache_path()
if not os.path.exists(cache_path):
    os.mkdir(cache_path)


def is_readable_file(file_path):
    try:
        if not os.path.exists(file_path):
            # print("File path is invalid.")
            return False
        elif not os.path.isfile(file_path):
            # print("File does not exist.")
            return False
        elif not os.access(file_path, os.R_OK):
            # print("File cannot be read.")
            return False
        else:
            # print("File can be read.")
            return True
    except Exception as e:
        print(f"isReadableFile error({e}")
    return False


def diagnose(package_name):
    path_to_file: str = _get_package_path(package_name)
    print(f"diagnose {path_to_file}")
    my_file = Path(path_to_file)
    try:
        with my_file.open() as fp:
            files = os.listdir(_get_cache_path())
            files = [d for d in files if "moment" in d]
            import json

            print(json.dumps(files, sort_keys=True, indent=4))
            print()
            data = fp.read()
            print("----------------------------------")
            print(os.path.isfile(path_to_file))
            print(os.path.getsize(path_to_file))
            print(type(data))
            print(f"data2 {data}")
            print("----------------------------------")
    except FileNotFoundError:
        print("File not found")
    except PermissionError:
        print("I do not have the permission to access", my_file)
    except UnicodeDecodeError:
        print("Could not decode UTF-8. Binary file or wrong encoding?")


def clean_if_invalid(package_name):
    path_to_file: str = _get_package_path(package_name)
    if exists(package_name) & (not file_is_valid(package_name)):
        clean_package_cache(path_to_file)


def exists(package_name: str) -> bool:
    path_to_file: str = _get_package_path(package_name)
    my_file = Path(path_to_file)
    return my_file.is_file()


def file_is_valid(package_name: str) -> bool:
    path_to_file: str = _get_package_path(package_name)
    try:
        if not os.path.exists(path_to_file):
            print("File path is invalid.")
            return False
        elif not os.path.isfile(path_to_file):
            print("File does not exist.")
            return False
        elif not os.access(path_to_file, os.R_OK):
            print("File cannot be read.")
            return False
        print("File can be read.")

        # sometimes, data scraped from online can be saved incorrectly as None
        my_file = Path(path_to_file)
        size = os.path.getsize(path_to_file)
        if size < 1000:  # optimization to not read every file
            with my_file.open() as fp:
                data = fp.read()
                # print(data)
                if data is None:
                    print("File is None")
                    return False
                if data == "null":
                    print("File is null")
                    return False
        return True
    except Exception as e:
        print(f"isReadableFile error({e}")
        return False


def save(package_name: str, data):
    try:
        path_to_file: str = _get_package_path(package_name)
        json_object = json.dumps(data, indent=4)
        if json_object is None:
            raise Exception("data from online is None")
        with open(path_to_file, "w+") as outfile:
            outfile.write(json_object)
    except Exception as e:
        raise e


def load(package_name: str) -> dict[str, Any]:
    path_to_file: str = _get_package_path(package_name)
    # print(path_to_file)
    # Use a try catch because file may be accessed between time we search for file and
    # the time we try to read the file
    try:
        with open(path_to_file) as open_file:
            json_object = json.load(open_file)
            return json_object
    except Exception as e:
        # file is inaccesable or does not exist
        # call scraper and wait until file is saved.
        raise e


def get_random_filenames(num_files=100):
    all_files = [
        f for f in os.listdir(cache_path) if os.path.isfile(os.path.join(cache_path, f))
    ]
    # Ensure we don't try to sample more files than are available
    num_files = min(num_files, len(all_files))

    # Randomly sample the files
    return random.sample(all_files, num_files)


def get_all_cache_filenames():
    filenames = []
    for filename in os.listdir(cache_path):
        filenames.append(filename)
    return filenames


def load_cache_file(filename: str):
    path_to_file = os.path.join(cache_path, filename)
    try:
        with open(path_to_file) as open_file:
            json_object = json.load(open_file)
            return json_object
    except Exception as e:
        # file is inaccesable or does not exist
        # call scraper and wait until file is saved.
        raise e


def clear_cache():
    for filename in os.listdir(cache_path):
        file_path = os.path.join(cache_path, filename)
        # clean_package_cache(file_path)
        print("Cash intentionally not cleared")
    return "success"


def clean_package_cache(file_path):
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        app.logger.error(f"Failed to delete {file_path}. Reason: {e}")


def _get_package_path(package_name: str) -> str:
    filename = _convert_to_filename(package_name)
    return os.path.join(cache_path, filename + ".json")


def _convert_to_filename(package_name: str) -> str:
    # for readability, keep some of the filename
    filename = _whitelist(package_name)
    file_hash = str(ns_hash(package_name, _HASH_LENGTH))
    # Most OS have maximum file lengths. make sure it is under 255
    if len(filename) + _HASH_LENGTH > 254:
        filename_new_len = 254 - _HASH_LENGTH
        filename = filename[:filename_new_len]

    return filename + "_" + file_hash


def _whitelist(package_name: str) -> str:
    return "".join(c for c in package_name if c in whitelist)
