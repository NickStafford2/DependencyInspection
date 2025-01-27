import os
from dynaconf import settings


def is_docker() -> bool:
    # print(settings)
    return "IS_DOCKER" in settings


def get_overrides() -> dict[str, str]:
    if settings["IS_DOCKER"]:
        return {"NEO4J_PASSWORD": _get_docker_secret()}
    # print(settings)
    return {}


def get_config() -> dict[str, str]:
    if settings["IS_DOCKER"]:
        settings["NEO4J_PASSWORD"] = _get_docker_secret()
    # print(settings)
    return settings


def _get_docker_secret() -> str:
    try:
        with open("/app/neo4j_auth.txt", "r") as file:
            secret_value = file.read()
            secret_value = secret_value.split("/")[-1].strip()
        return secret_value
    except FileNotFoundError:
        # print("The file ../neo4j_auth.txt was not found.")
        return "neo4j"
    except Exception as e:
        # print(f"An error occurred: {e}")
        return "neo4j"
