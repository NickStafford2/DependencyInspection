import logging
from dynaconf import settings


def is_docker() -> bool:
    return "IS_DOCKER" in settings


def get_overrides() -> dict[str, str]:
    if settings["IS_DOCKER"]:
        return {"NEO4J_PASSWORD": _get_docker_secret()}
    return {}


def get_config() -> dict[str, str]:
    if settings["IS_DOCKER"] == "true":
        settings["NEO4J_PASSWORD"] = _get_docker_secret()
    else:
        settings["NEO4J_PASSWORD"] = _get_local_secret()
    return settings


def _get_local_secret() -> str:
    try:
        with open("../neo4j_auth_local.txt", "r") as file:
            secret_value = file.read()
            secret_value = secret_value.split("/")[-1].strip()
        return secret_value
    except FileNotFoundError:
        logging.error("The file neo4j_auth.txt was not found.")
        return "neo4j"
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return "neo4j"


def _get_docker_secret() -> str:
    try:
        with open("/app/neo4j_auth.txt", "r") as file:
            secret_value = file.read()
            secret_value = secret_value.split("/")[-1].strip()
        return secret_value
    except FileNotFoundError:
        logging.error("The file neo4j_auth.txt was not found.")
        return "neo4j"
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return "neo4j"


def _print_settings():
    print(settings)
    print(type(settings))
    for s, v in settings.items():
        print(f"{s} : {v}")
    print()
