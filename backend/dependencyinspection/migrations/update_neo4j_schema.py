import subprocess
from pathlib import Path

from dynaconf import settings
from dependencyinspection.extensions.neo4j_connection import Neo4j_Connection


def update_db_from_neomodel():
    import neomodel

    print(neomodel.__file__)
    neomodel_path = Path(neomodel.__file__).parent
    labels_path = Path("scripts/neomodel_install_labels.py")
    script_path = neomodel_path / labels_path
    connection = Neo4j_Connection()
    db_url = connection.neo4j_neomodel_url
    command = ["python", script_path]
    command.extend(["dependencyinspection._models.package"])
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
