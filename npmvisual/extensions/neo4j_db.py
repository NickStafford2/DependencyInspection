import functools
from typing import Callable, Concatenate, ParamSpec, TypeVar

from flask.app import Flask
from neo4j import GraphDatabase
from neo4j._sync.driver import Driver
from neo4j._sync.work.transaction import ManagedTransaction
from typing_extensions import Concatenate, ParamSpec

P = ParamSpec("P")
R = TypeVar("R")


class Neo4j:
    app: Flask | None

    # def session_run(
    #     f: (**P) -> R
    # )-> (bool, **P) -> R:
    #     def
    #     pass
    #

    def __init__(self):
        self.app = None
        self.driver: Driver

    def init_app(self, app):
        self.app = app
        app.n4j = self  # type: ignore
        if "neo4j" in app.extensions:
            raise RuntimeError(
                "A 'neo4j' instance has already been registered on this Flask app."
                " Import and use that instance instead."
            )
        app.extensions["neo4j"] = self

        self.config = app.config
        self._connect()

    def _connect(self):
        URI = (
            "neo4j://" + self.config["NEO4J_HOST"]
        )  # + ":" + current_app.config["NEO4J_PORT"]
        AUTH = (
            self.config["NEO4J_USERNAME"],
            self.config["NEO4J_PASSWORD"],
        )
        self.database = self.config["NEO4J_DB"]
        self.driver = GraphDatabase.driver(URI, auth=AUTH)
        self.driver.verify_connectivity()
        print("db connection established")
        # self.driver = driver.session(database=database)
        return self.driver

    def get_driver(self):
        return self.driver

    def get_db(self):
        if not self.driver:
            return self._connect()
        return self.driver

    def teardown(self, exception):
        if self.driver:
            self.driver.close()
            print("db connection closed")

    def run(self, command):
        assert self.driver is not None, "Driver is not initialized!"
        with self.driver.session(database=self.database) as session:
            return session.run(command)

    # @session_run
    # def execute_write()

    # def execute_write(
    #     self,
    #     transaction_function: t.Callable[
    #         te.Concatenate[ManagedTransaction, _P], t.Union[_R]
    #     ],
    #     *args: _P.args,
    #     **kwargs: _P.kwargs,
    # ) -> _R:

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
        with self.driver.session(database=self.database) as session:
            return session.execute_write(transaction_function, *args, **kwargs)

    def session_run(self, input_function):
        @functools.wraps(input_function)
        def session_wrapper(*args, **kwargs):
            print("wrap start")
            return_value = input_function(*args, **kwargs)
            print("wrap ends")
            return return_value

    def session(self, input_function):
        def wrapper(*args, **kwargs):
            with self.driver.session(database=self.database) as session:
                return_value = session  # this is too gross
                return_value = input_function(*args, **kwargs)
                print("wrap ends")
                return return_value

        return wrapper

    # @session
    def execute_read(*args, **kwargs):
        kk = 0
