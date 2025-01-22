import hashlib
import json
import os
import random
import shutil
from collections.abc import Iterable
from typing import TypeVar, final, override
from dependencyinspection.config import is_docker

T = TypeVar("T")


def nsprint(text: str, num_tabs: int = 0, tab: str = "    "):
    if is_docker:
        return
    terminal_width = shutil.get_terminal_size().columns
    indent = tab * num_tabs
    max_line_length = terminal_width - len(indent)
    # Split the input text into separate lines based on existing newlines
    lines = text.splitlines()

    # For each line in the split lines, we will process it and wrap as necessary
    result_lines: list[str] = []
    first_line = True
    for line in lines:
        while len(line) > max_line_length:
            # Find the last space within the max length to break the line without cutting
            # words
            break_point = line.rfind(" ", 0, max_line_length)
            if break_point == -1:  # No spaces found, just break at the max length
                break_point = max_line_length

            # Add the line with the appropriate indentation
            result_lines.append(indent + line[:break_point])

            # Remove the portion of the text we've already printed
            line = line[break_point:].lstrip()
            if first_line:
                indent += tab
                max_line_length = terminal_width - len(indent)
                first_line = False

        # Add the last line (if any remaining text)
        if line:
            result_lines.append(indent + line)

    for line in result_lines:
        print(line)


def ns_hash(name: str, length: int = 40) -> str:
    hash: str = hashlib.sha1(name.encode("UTF-8")).hexdigest()
    return hash[:length]


@final
class Infinity:
    _instance = None

    def __new__(cls) -> object:
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    # Make it behave like an integer for comparisons
    def __lt__(self, other: "int | float | Infinity") -> bool:
        return False  # Anything is less than Infinity

    def __gt__(self, other: "int | float | Infinity") -> bool:
        return True  # Infinity is always greater than anything else

    @override
    def __eq__(self, other: object) -> bool:
        return isinstance(other, Infinity)

    def __le__(self, other: "int | float | Infinity") -> bool:
        return False  # Infinity is never less than or equal to anything else

    def __ge__(self, other: "int | float | Infinity") -> bool:
        return True  # Infinity is always greater than or equal to anything else

    @override
    def __repr__(self) -> str:
        return "Infinity"


# Singleton instance of Infinity
infinity = Infinity()


def get_all_package_names(max: int = 50, offset: int = 40) -> set[str]:
    def _helper():
        names = set()
        dir_path = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(dir_path, "data/package_cache/names.json")

        with open(file_path) as file:
            data = json.load(file)

        total_lines = len(data)
        stop_line = min(offset + max, total_lines)

        # Start processing the data from the offset
        for _, package_name in enumerate(data[offset:stop_line], start=offset):
            names.add(package_name)

        return names, total_lines

    names, total_lines = _helper()
    skipped_lines = total_lines - len(names)
    print(
        f"Created a set of all package names with {len(names)} elements. "
        f"This is {skipped_lines} less than the original file."
    )

    return names


def find_duplicates(lst: Iterable[T]) -> set[T]:
    seen: set[T] = set()
    duplicates: set[T] = set()
    for item in lst:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)

    return duplicates
