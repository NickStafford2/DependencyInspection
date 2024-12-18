# __init__.py
import logging
import os
import signal
import sys
from logging.handlers import RotatingFileHandler

import flask
from neomodel import db as neomodel_db

from config import Config
from npmvisual.extensions.neo4j_connection import Neo4j_Connection

# Make this outside of flask so it is available ouside of flask context
db = Neo4j_Connection(config_class=Config)


def create_app(config_class=Config):
    app = flask.Flask(__name__)
    app.config.from_object(config_class)
    _load_logs(app)
    # Activate extensions after flask exists to tell db manager how to connect to it.
    db.init_app(app)
    _init_graceful_shutdown()
    _init_blueprints(app)
    return app


def _init_blueprints(app: flask.Flask):
    from npmvisual.data import bp as data_bp

    app.register_blueprint(data_bp, url_prefix="/data")

    from npmvisual.graph import bp as graph_bp

    app.register_blueprint(graph_bp)

    from npmvisual.migrations import bp as migrations_bp

    app.register_blueprint(migrations_bp, url_prefix="/migrations")


def _init_graceful_shutdown():
    def handle_sigint(signal, frame):
        print("Shutting down gracefully...")
        if neomodel_db.driver:  # Ensure the driver exists and is connected
            neomodel_db.driver.close()
            print("db connection closed")
        sys.exit(0)

    _ = signal.signal(signal.SIGINT, handle_sigint)


def _load_logs(app: flask.Flask):
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
    app.logger.info("logger setup")
    return
