import logging
import os
from collections.abc import Callable
from typing import Concatenate, Final

from flask.app import Flask
from neo4j import GraphDatabase
from neo4j._sync.driver import Driver
from neo4j._sync.work.transaction import ManagedTransaction
from neomodel import config as neomodel_config
from typing_extensions import ParamSpec, TypeVar

import npmvisual.models
from config import Config

# from graphdatascience import GraphDataScience

P = ParamSpec("P")
R = TypeVar("R")


class Neo4j_Connection:
    EXTENSION_ID: Final[str] = "NEO4J_DB_CONNECTION"
    _app: Flask | None = None
    _config: Config | None = None
    _driver: Driver | None = None
    _neo4j_username: Final[str]
    _neo4j_password: Final[str]
    _neo4j_host: Final[str]
    _neo4j_db: Final[str]
    _neo4j_port: Final[str]
    neo4j_neomodel_url: Final[str]
    _neo4j_uri: str = ""
    _neo4j_auth: tuple[str, str] = ("", "")
    _database2: str = ""
    _is_aura: Final[bool]

    def __init__(self, config_class=Config, auto_connect=True):
        print("Neo4j_Connection init()")
        self._neo4j_username = config_class.NEO4J_USERNAME
        self._neo4j_password = config_class.NEO4J_PASSWORD
        self._neo4j_host = config_class.NEO4J_HOST
        self._neo4j_db = config_class.NEO4J_DB
        self._neo4j_port = os.environ.get("NEO4J_PORT", "7687")
        self._neo4j_auth = (self._neo4j_username, self._neo4j_password)
        if config_class.NEO4J_URI:
            self._is_aura = True
            self._neo4j_uri = config_class.NEO4J_URI 
            method, db_path= self._neo4j_uri.split("//", 1)
            self.neo4j_neomodel_url = (
                f"{method}//{self._neo4j_username}:{self._neo4j_password}@{db_path}"
            )
        else: 
            self._is_aura = False 
            self._neo4j_uri = (
                "neo4j://" + self._neo4j_host
            )  # + ":" + current_app.config["NEO4J_PORT"]
            self.neo4j_neomodel_url = (
                f"bolt://{self._neo4j_username}:{self._neo4j_password}@localhost:7687"
            )
        neomodel_config.DATABASE_URL = self.neo4j_neomodel_url
        self._database2 = self._neo4j_db # can't remember why I made this. 
        if auto_connect:
            self._init_connection()

    def _init_connection(self):
        """This exists so that neomodel will be on the same thread as Flask. This function
        must be called before flask is created."""
        important_do_not_delete = npmvisual.models.NeomodelConnectionTest()
        _ = important_do_not_delete.save()

    def init_app(self, app: Flask):
        print("Neo4j_Connection init_app()")
        self._app = app
        app.n4j = self  # type: ignore
        if self.EXTENSION_ID in app.extensions:
            raise RuntimeError(
                "A 'neo4j' instance has already been registered on this Flask app."
                + " Import and use that instance instead."
            )
        app.extensions[self.EXTENSION_ID] = self
        self._config = app.config
        _ = self._connect()
        _ = app.teardown_appcontext(self._teardown)

    def _connect(self):
        self._driver = GraphDatabase.driver(uri=self._neo4j_uri, auth=self._neo4j_auth)

        # Configure Neomodel connection to use the same driver
        self._verify_connectivity()

        # gds = GraphDataScience(URI, AUTH)
        # print(gds.version())
        # assert gds.version()
        return self._driver

    def _verify_connectivity(self):
        # Ensure the connection is working
        try:
            if self._driver:
                self._driver.verify_connectivity()
                logging.info("Neo4j connection established.")
        except Exception as e:
            logging.error(f"Error connecting to Neo4j: {e}")
            raise

    def get_driver(self):
        if not self._driver:
            return self._connect()
        return self._driver

    def _teardown(self, exception: BaseException | None):
        print(f"closing db. exception: {exception}")
        if self._driver:
            self._driver.close()
            print("db connection closed for driver")

    def run(self, command):
        assert self._driver is not None, "Driver is not initialized!"
        with self._driver.session(database=self._database2) as session:
            return session.run(command)

    def execute_read(
        self,
        transaction_function: Callable[Concatenate[ManagedTransaction, P], R],
        *args: P.args,
        **kwargs: P.kwargs,
    ) -> R:
        """
        A very thin wrapper around the Neo4j execute_read. All the Parameters and return
        types should be identical.

        This is needed because sessions are used short term, and there won't be a single
        session for the flask app to access.
        """
        assert self._driver is not None, "Driver is not initialized!"
        with self._driver.session(database=self._database2) as session:
            return session.execute_read(transaction_function, *args, **kwargs)

    def execute_write(
        self,
        transaction_function: Callable[Concatenate[ManagedTransaction, P], R],
        *args: P.args,
        **kwargs: P.kwargs,
    ) -> R:
        """
        A very thin wrapper around the Neo4j execute_write. All the Parameters and return
        types should be identical.

        This is needed because sessions are used short term, and there won't be a single
        session for the flask app to access.
        """
        assert self._driver is not None, "Driver is not initialized!"
        with self._driver.session(database=self._database2) as session:
            return session.execute_write(transaction_function, *args, **kwargs)
