from collections.abc import Callable
from dataclasses import dataclass

from neo4j._sync.work.result import Result
from neo4j._sync.work.transaction import ManagedTransaction

from npmvisual import db
from npmvisual.migrations import bp, migration_functions
from npmvisual.migrations.migration_functions import *


# todo: clean this up. make a single node, make a cypher rule to prevent more than
# migration node


@dataclass
class Migration:
    migration_id: str
    timestamp: int
    func: Callable[[], object]


def int_readable(n: int) -> str:
    """Return a string representation of the integer with commas for readability."""
    return f"{n:,}"


def create_migration_list() -> list[Migration]:
    """
    Creates a list of function names and functions from another file. Yes I know this is a
    hack, but I don't want to add more dependencies and learn another db migration
    software that I don't even know if it works.
    """
    migrations: list[Migration] = []
    print(f'Creating migration list from module "{migration_functions.__name__}"')

    for attr in dir(migration_functions):
        atr = getattr(migration_functions, attr)
        if callable(atr):
            name: str = atr.__name__
            x = name.split("_")
            if len(x) == 2 and x[0] == "migration":
                timestamp = get_timestamp(name)
                migrations.append(
                    Migration(migration_id=name, timestamp=timestamp, func=atr)
                )
    migrations.sort(key=lambda migration: migration.migration_id)
    print("Migration List made successfully")
    return migrations


# never use this unless you know what you are doing
# @bp.route("/delete_all")
def delete_all_migrations():
    def delete_all_migrations_tx(tx: ManagedTransaction):
        tx.run(
            """
            MATCH (m:Migration)
            DELETE m
            """,
        )

    db.execute_write(delete_all_migrations_tx)
    return "success"


def set_current_migration_tx(
    tx: ManagedTransaction,
    migration_id: str,
):
    tx.run(
        """
        MERGE (m:Migration {
            migration_id: $migration_id
          })
        ON CREATE SET m.created = timestamp()
        ON MATCH SET
        m.counter = coalesce(m.counter, 0) + 1,
        m.accessTime = timestamp()
        """,
        migration_id=migration_id,
    )


def get_migration_count(tx: ManagedTransaction) -> int:
    result: Result = tx.run(
        """
        MATCH (m:Migration)
        RETURN COUNT(m) as migration_count
        """,
    )
    record = result.single()
    if record is None:
        return 0
    return record["migration_count"]


def get_current_migration_id_tx(tx: ManagedTransaction) -> str:
    records = []
    result: Result = tx.run(
        """
        MATCH (m:Migration)
        RETURN m.migration_id as migration_id
        """,
    )
    for record in result:
        x = record["migration_id"]
        records.append(x)
    # should only be one. crash if someone made another or if it does not exist
    assert len(records) == 1
    return records[0]


def get_timestamp(migration_id: str) -> int:
    """
    migration_id functions should be of the format
        migration_timestamp

    That should be the function name. Also, never edit these funtions once created
    Copy paste
    """
    return int(migration_id.split("_")[1])


@bp.route("/upgrade", methods=["GET"])
def upgrade():
    """
    Run any migrations ahead of current. set current_timestamp in db after every migration
    """
    count = db.execute_read(get_migration_count)
    if count == 0:
        reset()
    migrations = create_migration_list()
    current_id = db.execute_write(get_current_migration_id_tx)
    current_timestamp = get_timestamp(current_id)
    migrations_after_current: list[Migration] = []
    m: Migration
    print("Listing all migrations")
    for m in reversed(migrations):
        if m.timestamp > current_timestamp:
            print(f" -> {int_readable(current_timestamp)} current")
        print(f"    {int_readable(m.timestamp)}  - {m}")

    for m in migrations:
        # print(f"  {m}")
        timestamp = get_timestamp(m.migration_id)
        if timestamp > current_timestamp:
            migrations_after_current.append(m)

    print(
        f"\nThere are {len(migrations_after_current)} migrations ahead of current "
        f"timestamp {int_readable(current_timestamp)}:"
    )
    for m in migrations_after_current:
        time_difference = m.timestamp - current_timestamp
        print(
            f"\t {m.migration_id }: Ahead by {int_readable(time_difference)} milliseconds"
        )
        m.func()
        current_timestamp = m.timestamp
        db.execute_write(set_current_migration_tx, m.migration_id)
    return "success"


# never use this unless you know what you are doing
@bp.route("/reset")
def reset():
    """
    Remove all migrations and start fresh. rerun the first migration in the file, which
    creates the migration db object to track current migration.
    """
    delete_all_migrations()
    migrations = create_migration_list()
    migration_init = migrations[0]
    migration_init.func()
    return "success"
