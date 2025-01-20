import asyncio

from dependencyinspection import create_app

app = asyncio.run(create_app())
