import string


class NSAliasGenerator:
    """A simple generator for unique aliases (a, b, c, ..., aa, ab, ac, ...)."""

    _instance = None  # Class variable to hold the single instance
    predefined = {
        "str": "_str",
        "int": "_int",
        "float": "_float",
        "bool": "_bool",
        "list[]": "_[]",
        "list[_str]": "[str]",
        "list[dict]": "_[dict]",
        "dict[str,dict]{}": "_{}",
        "dict[str,dict]{(email,_str),(name,_str)}": "_Contact",
        "dict[str,dict]{(email,_str),(name,_str),(url,_str)}": "_Contact",
        "dict[str,dict]{(name,_str),(url,_str)}": "_Contact",
        "list[_Contact]": "[_Contact]",
        "dict[str,dict]{(keyid,_str),(sig,_str)}": "_Signature",
        "list[_Signature]": "[_Signature]",
        # Dist
        "dict[str,dict]{(fileCount,_int),(integrity,_str),(npm-signature,_str),(shasum,_str),(signatures,[_Signature]),(tarball,_str),(unpackedSize,_int)}": "_Dist",
        "dict[str,dict]{(fileCount,_int),(integrity,_str),(shasum,_str),(signatures,[_Signature]),(tarball,_str),(unpackedSize,_int)}": "_Dist",
        "dict[str,dict]{(integrity,_str),(shasum,_str),(tarball,_str),(fileCount,_int),(unpackedSize,_int),(signatures,[_Signature])}": "_Dist",
        "dict[str,dict]{(integrity,_str),(shasum,_str),(tarball,_str),(fileCount,_int),(unpackedSize,_int),(npm-signature,_str),(signatures,[_Signature])}": "_Dist",
        "dict[str,dict]{(integrity,_str),(shasum,_str),(signatures,[_Signature]),(tarball,_str)}": "_Dist",
        # Dist
        "dict[str,dict]{(type,_str),(url,_str)}": "_Funding",
        "dict[str,dict]{(directory,_str),(type,_str),(url,_str)}": "_Repository",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
    }

    def __new__(cls, *args, **kwargs):
        # Check if an instance already exists
        if cls._instance is None:
            # If not, create it and store in _instance
            cls._instance = super(NSAliasGenerator, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        # Start from 'a'
        self.counter = 0
        self.alphabet = string.ascii_lowercase  # 'a' to 'z'

    def generate_alias(self, structure: str) -> str:
        """Generate the next unique alias in the sequence (a, b, c, ..., aa, ab, ac, ...)."""
        if structure in self.predefined:
            return self.predefined[structure]
        alias = "_" + self._int_to_base26(self.counter)
        self.counter += 1
        return alias

    def _int_to_base26(self, num: int) -> str:
        """Convert an integer to a base-26 string (like Excel column numbering)."""
        result = []
        while num >= 0:
            result.append(self.alphabet[num % 26])
            num = num // 26 - 1
            if num < 0:
                break
        return "".join(reversed(result))
