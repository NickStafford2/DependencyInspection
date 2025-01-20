import asyncio

from dependencyinspection.application import create_app

print("in manage.py")

app = asyncio.run(create_app())
