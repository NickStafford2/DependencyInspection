# __init__.py
# import asyncio
import logging
import os
import signal
import sys
from logging.handlers import RotatingFileHandler

import quart
from neomodel import db as neomodel_db

# from quart import copy_current_websocket_context, websocket
from config import Config
from dependencyinspection.extensions.neo4j_connection import Neo4j_Connection

# from dependencyinspection.server_sent_event import ServerSentEvent
# Make this outside of quart so it is available ouside of quart context
db = Neo4j_Connection(config_class=Config)


def create_app(config_class=Config):
    app = quart.Quart(__name__)
    app.config.from_object(config_class)
    _load_logs(app)
    # Activate extensions after quart exists to tell db manager how to connect to it.
    db.init_app(app)
    _init_graceful_shutdown()
    _init_blueprints(app)

    # @app.route("/")
    # async def home():
    #     return "hi"
    #
    # async def consumer():
    #     while True:
    #         data = "sent data from backend"
    #         await websocket.send(data)
    #         print(f"sent{data}")
    #
    # async def producer():
    #     while True:
    #         data = await websocket.receive()
    #         print(f"recieved {data}")
    #
    # @app.websocket("/ws")
    # async def ws():
    #     consumer_task = asyncio.ensure_future(
    #         copy_current_websocket_context(consumer)(),
    #     )
    #     producer_task = asyncio.ensure_future(
    #         copy_current_websocket_context(producer)(),
    #     )
    #     try:
    #         await asyncio.gather(consumer_task, producer_task)
    #     finally:
    #         consumer_task.cancel()
    #         producer_task.cancel()
    #     # producer = asyncio.create_task(sending())
    #     # consumer = asyncio.create_task(receiving())
    #     # await asyncio.gather(producer, consumer)
    #
    # @app.websocket("/ws2")
    # async def ws2():
    #
    return app


def _init_blueprints(app: quart.Quart):
    from dependencyinspection.data import bp as data_bp

    app.register_blueprint(data_bp, url_prefix="/data")

    from dependencyinspection.graph import bp as graph_bp

    app.register_blueprint(graph_bp)

    from dependencyinspection.migrations import bp as migrations_bp

    app.register_blueprint(migrations_bp, url_prefix="/migrations")


def _init_graceful_shutdown():
    def handle_sigint(signal, frame):
        print("Shutting down gracefully...")
        if neomodel_db.driver:  # Ensure the driver exists and is connected
            neomodel_db.driver.close()
            print("db connection closed")
        sys.exit(0)

    print("Shutdown started...")
    _ = signal.signal(signal.SIGINT, handle_sigint)


def _load_logs(app: quart.Quart):
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
