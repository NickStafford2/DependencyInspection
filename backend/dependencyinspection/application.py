# application.py
# import asyncio
import logging
from logging.handlers import RotatingFileHandler
import os

import signal
import sys

from typing import Any

from dependencyinspection import config
from dynaconf import FlaskDynaconf
from dependencyinspection.config import get_overrides, is_docker
from quart import Quart

from neomodel import db as neomodel_db

# from quart import copy_current_websocket_context, websocket
# from config import Config

from dependencyinspection.extensions.neo4j_connection import Neo4j_Connection

# from dependencyinspection.server_sent_event import ServerSentEvent
# Make this outside of quart so it is available ouside of quart context
db = Neo4j_Connection()


# async def create_app(config_class=Config):
async def create_app(**config_overrides: Any) -> Quart:
    app = Quart(__name__)
    _init_config(app, **config_overrides)
    _load_logs(app)
    app.logger.info("app started")
    # Activate extensions after quart exists to tell db manager how to connect to it.
    db.init_app(app)
    _init_graceful_shutdown()
    _init_blueprints(app)

    @app.route("/healthcheck")
    async def healthcheck():
        return "healthy", 200

    return app


def _init_config(app: Quart, **config_overrides: Any) -> None:
    FlaskDynaconf(app)
    app.config.update(get_overrides())
    app.config.update(config_overrides)


def _init_blueprints(app: Quart):
    prefix = "/api" if is_docker() else ""
    from dependencyinspection.data import bp as data_bp

    app.register_blueprint(data_bp, url_prefix=f"{prefix}/data")

    from dependencyinspection.graph import bp as graph_bp

    app.register_blueprint(graph_bp, url_prefix=f"{prefix}/")

    from dependencyinspection.migrations import bp as migrations_bp

    app.register_blueprint(migrations_bp, url_prefix=f"{prefix}/migrations")


def _init_graceful_shutdown():
    def handle_sigint(signal, frame):
        logging.info("Shutting down gracefully...")
        if neomodel_db.driver:  # Ensure the driver exists and is connected
            neomodel_db.driver.close()
            logging.info("db connection closed")
        sys.exit(0)

    logging.info("Shutdown started...")
    _ = signal.signal(signal.SIGINT, handle_sigint)


def _load_logs(app: Quart):
    if not os.path.exists("logs"):
        os.mkdir("logs")
    file_handler = RotatingFileHandler("logs/app.log", maxBytes=10240, backupCount=10)
    file_handler.setFormatter(
        logging.Formatter(
            "%(asctime)s %(levelname)s: %(message)s " "[in %(pathname)s:%(lineno)d]"
        )
    )
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)

    app.logger.setLevel(logging.INFO)
    # app.logger.info("logger setup")
    return
