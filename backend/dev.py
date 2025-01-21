# scripts/dev.py
import subprocess


def start_hypercorn():
    subprocess.run(
        [
            "poetry",
            "run",
            "hypercorn",
            "dependencyinspection.asgi:app",
            "-b",
            "0.0.0.0:5001",
            "--reload",
        ]
    )
