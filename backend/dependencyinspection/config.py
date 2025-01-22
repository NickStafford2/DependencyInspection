import os
from dynaconf import settings


def is_docker() -> bool:
    return "IS_DOCKER" in settings


def get_overrides() -> dict[str, str]:
    if settings["IS_DOCKER"]:
        return {"NEO4J_PASSWORD": _get_docker_secret()}
    return {}


def get_config() -> dict[str, str]:
    if settings["IS_DOCKER"]:
        settings["NEO4J_PASSWORD"] = _get_docker_secret()
    return settings


def _get_docker_secret() -> str:
    secret_value = os.getenv("NEO4J_PASSWORD") or "docker secret not set"
    return secret_value
