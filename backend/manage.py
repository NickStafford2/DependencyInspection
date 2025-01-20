import asyncio

from dependencyinspection.application import create_app

app = asyncio.run(create_app())
