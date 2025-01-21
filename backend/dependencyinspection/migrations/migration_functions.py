from neo4j._sync.work.transaction import ManagedTransaction

from dependencyinspection.application import db

"""
DO NOT EVER EDIT FUNCTIONS IN THIS FILE. I HAVE NOT MADE DOWNGRADE. 
JUST ADD MORE UPGRADES TO FIX STUFF

COPY PASTE IS YOUR FRIEND. 

name of migrations should be: "migration_timestamp"
where timestamp is milliseconds since the epoch. 

I made a handy CopyTimestamp.tsx component on the website. use that. 
"""


def migration_1735034798626():
    """Updated Package to include scrape date information. Created placeholder Package"""
    from . import update_neo4j_schema

    update_neo4j_schema.update_db_from_neomodel()


def migration_1735013015695():
    """Replace PackageNode with Package. Huge change to schema. Added relationships."""
    from . import update_neo4j_schema

    update_neo4j_schema.update_db_from_neomodel()


def migration_1731556707326():
    """Remove old schema constraints"""

    def _delete_duplicate(
        tx: ManagedTransaction,
    ):
        tx.run("""DROP CONSTRAINT unique_package_node_id IF EXISTS""")

    db.execute_write(_delete_duplicate)


def migration_1731556705326():
    """Ensuring PackageNodes are unique"""

    def _delete_duplicate(
        tx: ManagedTransaction,
    ):
        tx.run("""DROP CONSTRAINT unique_package_node_id IF EXISTS""")

    def _create_unique_package_ids(
        tx: ManagedTransaction,
    ):
        tx.run(
            """
            CREATE CONSTRAINT unique_package_node_id 
            FOR (n:PackageNode) 
            REQUIRE n.package_id IS UNIQUE
            """,
        )

    db.execute_write(_delete_duplicate)
    db.execute_write(_create_unique_package_ids)


def migration_1729922231172():
    """created new db migration system"""

    def create_migration_system_tx(
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

    db.execute_write(create_migration_system_tx, "migration_1729922231172")
