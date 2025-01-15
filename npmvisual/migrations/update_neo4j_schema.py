import subprocess

from config import Config
from npmvisual.extensions.neo4j_connection import Neo4j_Connection


def update_db_from_neomodel():
    connection = Neo4j_Connection(Config)
    db_url = connection.neo4j_neomodel_url
    script_path = (
        ".venv/lib/python3.12/site-packages/neomodel/scripts/neomodel_install_labels.py"
    )
    command = ["python", script_path]
    command.extend(["npmvisual._models.package"])
    command.extend(["--db", db_url])

    try:
        print(command)
        subprocess.run(command, check=True)
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
        )
        print(f"Successfully executed {script_path}, result: {result}")
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_path}: {e}")
    except FileNotFoundError:
        print(f"Script {script_path} not found")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    update_db_from_neomodel()
