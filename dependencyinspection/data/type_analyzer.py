from collections import OrderedDict
from dataclasses import dataclass
from typing import Any
from dependencyinspection._models.ns_pretty_printable import NSPrettyPrintable
from dependencyinspection.data.alias_generator import NSAliasGenerator

COUNT = 1


class NSType:
    alias: str | None
    structure: str
    structure_full: str
    children: dict["str", "NSType"] | None = None
    self_type: str
    attrs: list[str] = []
    generator = NSAliasGenerator()
    previous_key = None

    def __init__(self, t: Any, previous_key=None):
        self.self_type = type(t).__name__
        self.previous_key = previous_key

        # _pretty_print_type_structure(t)
        # global COUNT
        # print(f"\n\n\ninit of NSType. {self.self_type} count ={COUNT}")
        # COUNT += 1

        if NSType.is_primitive(t):
            self.structure = self.self_type
            self.structure_full = self.self_type

        elif isinstance(t, list):
            # for k in t:
            # print(f"nsType dict children: {k}")
            self.children = {str(k): NSType(v, k) for k, v in enumerate(t)}
            child_structures = ""
            child_alias = ""
            if self.children:
                child_structures = list(self.children.values())[0].structure
                child_alias = list(self.children.values())[0].alias
            self.structure = f"list[{child_alias}]"
            self.structure_full = f"list[{child_structures}]"

        elif isinstance(t, dict):
            to_ignore = [
                "dependencies",
                "peerDependencies",
                "devDependencies",
                "devDependencies",
                "keywords",
                "scripts",
            ]
            self.children = {
                k: NSType(v, k) for k, v in t.items() if k not in to_ignore
            }
            structure = f"dict[str,{self.self_type}]{{"
            structure_full = f"dict[str,{self.self_type}]{{"

            sorted_keys = list(self.children.keys())
            sorted_keys.sort()
            for key in sorted_keys:
                val = self.children[key]
                self.attrs.append(key)
                structure += f"({key},{val.alias}),"
                structure_full += f"({key},{val.structure_full}),"
            if len(self.children):
                structure = structure[:-1]  # remove trailing comma
                structure_full = structure_full[:-1]  # remove trailing comma and \n
            structure += "}"
            structure_full += "}"
            self.structure = f"%{self.previous_key}%{structure}"
            self.structure_full = f"%{self.previous_key}%{structure_full}"

        else:
            raise TypeError(f"Unknown type: {type(t).__name__} (value: {t})")

        self.alias = self.generator.generate_alias(self.structure)
        NSTypeDB.add(self)

    def is_leaf(self):
        return self.children is None

    @staticmethod
    def is_primitive(obj):
        return isinstance(obj, int | float | bool | str | bytes | type(None))


@dataclass
class NSTypeCount:
    nstype: NSType
    count = 1


class NSTypeDB:
    _instance = None  # Class variable to hold the single instance
    all_types: dict[str, NSTypeCount] = {}

    def __new__(cls, *args, **kwargs):
        # Check if an instance already exists
        if cls._instance is None:
            # If not, create it and store in _instance
            cls._instance = super(NSTypeDB, cls).__new__(cls)
        return cls._instance

    @classmethod
    def add(cls, unknown_type: NSType):
        if unknown_type.structure_full in cls.all_types:
            cls.all_types[unknown_type.structure_full].count += 1
        else:
            cls.all_types[unknown_type.structure_full] = NSTypeCount(unknown_type)

    @classmethod
    def print(cls):
        print("===" * 44)
        print("===" * 44)
        print("===" * 44)
        sorted_types = sorted(
            cls.all_types.values(), key=lambda t: t.count, reverse=True
        )
        for t in sorted_types:
            if (
                t.count > 10
                and t.nstype.alias not in NSAliasGenerator.predefined.values()
            ):
                print(
                    f'count={t.count} {t.nstype.alias} \n\t"{t.nstype.structure}"'  # \n\t"{t.nstype.structure_full}"'
                )
        print("===" * 44)
        print("===" * 44)
        print("===" * 44)


def _pretty_print_type_structure(data: Any, indent: int = 0):
    # Helper function to format and print the data recursively
    space = " " * indent
    if isinstance(data, dict):
        for key, value in data.items():
            print(f"{space}{key}:")
            _pretty_print_type_structure(value, indent + 2)

    elif isinstance(data, list):
        for index, item in enumerate(data):
            print(f"{space}- Item {index + 1}:")
            _pretty_print_type_structure(item, indent + 2)

    elif isinstance(data, str):
        print(f"{space}- {NSPrettyPrintable.format_string(data, 100)}")
    else:
        # Print the type for primitive values
        print(f"{space}- {data}")


def _get_type_structure(data: dict[str, Any]):
    def recursive_type_structure(value: Any) -> Any:
        if isinstance(value, dict):
            # Recurse into a dictionary and apply recursively to each key-value pair
            return {k: recursive_type_structure(v) for k, v in value.items()}

        elif isinstance(value, list):
            # Process each element in the list and return a list of types
            return [recursive_type_structure(v) for v in value]

        else:
            # Return the type of the value if it's a primitive or object type
            return [type(value).__name__]

    if data and data.items():
        return {k: recursive_type_structure(v) for k, v in data.items()}
    else:
        print(f"???????????????????????{data}")


def _print_json_variable(json_dict):
    some_key = "could not find"
    some_key = json_dict.get("license")
    print(some_key)
    versions: dict[str, Any] = json_dict.get("versions")  # type: ignore
    vers_tag = None  # "3.0.0"
    # print(versions[vers_tag])
    if versions and vers_tag and versions[vers_tag]:
        # if versions and len(versions) > 0:
        last_item = versions[vers_tag]  # Any = sorted(versions.items())[-1][1]
        some_key = last_item.get("contributors")
        # structure = _get_type_structure(some_key)
        # _pretty_print_type_structure(structure)
        # nsprint(
        #     f"some_key:{some_key}",
        # )
    print(f"\nkey: {some_key}\n")


input_data = {
    "name": "Alice",
    "age": 30,
    "is_student": False,
    "grades": [90, 85, 92],
    "address": {"city": "Wonderland", "zip": "12345"},
    "hobbies": None,
    "scores": {"math": 95, "science": 88},
}


# Testing function
def test_nstype(input_data):
    print("Testing NSType with the following input data:")
    print(input_data)
    print("\nCreating NSType instance...\n")

    # Create an NSType instance
    nstype_instance = NSType(input_data)

    # Print the NSType instance
    print("NSType instance:")
    print(nstype_instance)

    # Print the shared first_instance_data
    print("\nAll Types:")
    NSTypeDB.print()


if __name__ == "__main__":
    test_nstype(input_data)
