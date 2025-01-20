from typing import Any

from pydantic import BaseModel, Field, ValidationError
from pydantic.functional_validators import model_validator

# Define the Nested Models for Complex Fields


class NpmUser(BaseModel):
    email: str
    name: str


class NpmOperationalInternal(BaseModel):
    host: str
    tmp: str


class Bin(BaseModel):
    ng_xi18n: str | None = Field(None, alias="ng-xi18n")
    ngc: str | None = None


class Bugs(BaseModel):
    url: str


class Contributor(BaseModel):
    email: str
    name: str
    url: str


class DistSignature(BaseModel):
    keyid: str
    sig: str


class Dist(BaseModel):
    integrity: str
    shasum: str
    signatures: list[DistSignature]
    tarball: str


class Repository(BaseModel):
    type: str
    url: str


class DBPackageRelationships(BaseModel):
    dependencies: list[str]
    peer_dependencies: list[str]
    dev_dependencies: list[str]


# Main Package_Version Model
class PackageVersion(BaseModel):
    # Required Fields
    id: str = Field(..., alias="_id")  # Mapping '_id' in input JSON to 'id' in the model
    version: str
    dist: Dist
    name: str
    relationships: DBPackageRelationships

    # Optional Fields
    from_package: str | None = Field(None, alias="_from")
    node_version: str | None = Field(None, alias="_nodeVersion")
    npm_version: str | None = Field(None, alias="_npmVersion")
    resolved: str | None = Field(None, alias="_resolved")
    shasum: str | None = Field(None, alias="_shasum")
    description: str | None = None
    homepage: str | None = None
    license: str | None = None
    main: str | None = None
    typings: str | None = None

    keywords: list[str] | None = None
    dependencies: dict[str, str] | None = None
    peer_dependencies: dict[str, str] | None = Field(None, alias="peerDependencies")
    dev_dependencies: dict[str, str] | None = Field(None, alias="devDependencies")

    directories: dict[str, Any] | None = None  # Empty dictionary (can be expanded later)
    scripts: dict[str, Any] | None = None  # Empty dictionary (can be expanded later)

    npm_user: NpmUser | None = Field(None, alias="_npmUser")
    maintainers: list[NpmUser] | None = None
    contributors: list[Contributor] | None = None

    bin: Bin | None = None
    bugs: Bugs | None = None
    repository: Repository | None = None
    npm_operational_internal: NpmOperationalInternal = Field(
        ..., alias="_npmOperationalInternal"
    )  # todo: check this one. I don't see it in the interfaces.ts file. I forget why i added this

    # class Config:
    # extra = "forbid"  # Forbid extra fields
    # allow_population_by_field_name = True  # Allow usage of field names in the model

    @model_validator(mode="before")
    def populate_relationships(cls, values):
        # Extract dependencies from the model's values
        peer_dependencies = values.get("peer_dependencies", {})
        dev_dependencies = values.get("dev_dependencies", {})
        dependencies = values.get("dependencies", {})

        # Format dependencies to the required format
        relationships = DBPackageRelationships(
            dependencies=[
                f"{pkg}@{ver.replace('^', '')}"
                for pkg, ver in (dependencies or {}).items()
            ],
            dev_dependencies=[
                f"{pkg}@{ver.replace('^', '')}"
                for pkg, ver in (dev_dependencies or {}).items()
            ],
            peer_dependencies=[
                f"{pkg}@{ver.replace('^', '')}"
                for pkg, ver in (peer_dependencies or {}).items()
            ],
        )

        # Attach the relationships field to the values dictionary before returning
        values["relationships"] = relationships

        return values

    # @classmethod
    # def _build_merge_query(
    #     cls, merge_params, update_existing=False, lazy=False, relationship=None
    # ):
    #     """
    #     Get a tuple of a CYPHER query and a params dict for the specified MERGE query.
    #
    #     :param merge_params: The target node match parameters, each node must have a "create" key and optional "update".
    #     :type merge_params: list of dict
    #     :param update_existing: True to update properties of existing nodes, default False to keep existing values.
    #     :type update_existing: bool
    #     :rtype: tuple
    #     """
    #     query_params = dict(merge_params=merge_params)
    #     n_merge_labels = ":".join(cls.inherited_labels())
    #     n_merge_prm = ", ".join(
    #         (
    #             f"{getattr(cls, p).get_db_property_name(p)}: params.create.{getattr(cls, p).get_db_property_name(p)}"
    #             for p in cls.__required_properties__
    #         )
    #     )
    #     n_merge = f"n:{n_merge_labels} {{{n_merge_prm}}}"
    #     if relationship is None:
    #         # create "simple" unwind query
    #         query = f"UNWIND $merge_params as params\n MERGE ({n_merge})\n "
    #     else:
    #         # validate relationship
    #         if not isinstance(relationship.source, StructuredNode):
    #             raise ValueError(
    #                 f"relationship source [{repr(relationship.source)}] is not a StructuredNode"
    #             )
    #         relation_type = relationship.definition.get("relation_type")
    #         if not relation_type:
    #             raise ValueError("No relation_type is specified on provided relationship")
    #
    #         from neomodel.sync_.match import _rel_helper
    #
    #         query_params["source_id"] = db.parse_element_id(
    #             relationship.source.element_id
    #         )
    #         query = f"MATCH (source:{relationship.source.__label__}) WHERE {db.get_id_method()}(source) = $source_id\n "
    #         query += "WITH source\n UNWIND $merge_params as params \n "
    #         query += "MERGE "
    #         query += _rel_helper(
    #             lhs="source",
    #             rhs=n_merge,
    #             ident=None,
    #             relation_type=relation_type,
    #             direction=relationship.definition["direction"],
    #         )
    #
    #     query += "ON CREATE SET n = params.create\n "
    #     # if update_existing, write properties on match as well
    #     if update_existing is True:
    #         query += "ON MATCH SET n += params.update\n"
    #
    #     # close query
    #     if lazy:
    #         query += f"RETURN {db.get_id_method()}(n)"
    #     else:
    #         query += "RETURN n"
    #
    #     return query, query_params

    def prettyPrint(self):
        def _trim_string_with_ellipsis(input_string: str, max_length: int) -> str:
            if len(input_string) > max_length:
                return (
                    input_string[: max_length - 3] + "..."
                )  # Leave space for the ellipsis
            return input_string

        strBuilder = f"  PackageVersion: \t{self.id}\n"
        for (
            var,
            value,
        ) in self.model_dump().items():  # Use .items() to iterate over key-value pairs
            if isinstance(value, str):
                value = _trim_string_with_ellipsis(value, 44)
            strBuilder += f"     {var}: {value}\n"  # Convert value to string and format
        print(strBuilder)

    # def populate_relationships(cls, values):
    #     # initilize this to an empty object so pydantic stays happy. It throws an error if
    #     # a required field is not set when super()__init__ is called
    #     self.relationships = DBPackageRelationships(
    #         dependencies=[],
    #         dev_dependencies=[],
    #         peer_dependencies=[],
    #     )
    #
    #     super().__init__(**data)
    #
    #     # Manually handle the 'relationships' field, initialize it separately after
    #     # pydantic because we need the values from pydantic
    #     for package_name, version in (self.peer_dependencies or {}).items():
    #         formated_version = version.replace("^", "")
    #         self.relationships.peer_dependencies.append(
    #             package_name + "@" + formated_version
    #         )
    #
    #     for package_name, version in (self.dev_dependencies or {}).items():
    #         formated_version = version.replace("^", "")
    #         self.relationships.dev_dependencies.append(
    #             package_name + "@" + formated_version
    #         )
    #
    #     for package_name, version in (self.dependencies or {}).items():
    #         formated_version = version.replace("^", "")
    #         self.relationships.dependencies.append(package_name + "@" + formated_version)


# Example Function to Create Package Version from JSON


def package_version_from_json(json_data: dict[str, Any]) -> PackageVersion | None:
    # print(json_data.get("_from"))
    try:
        return PackageVersion.model_validate(
            json_data
        )  # Use parse_obj to validate and create the model
    except ValidationError as e:
        print(f"Validation error: {e}")
        return None
