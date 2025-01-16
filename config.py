import os
from typing import final

from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
_ = load_dotenv(os.path.join(basedir, ".env"))


@final
class Config:
    NEO4J_USERNAME: str = os.environ.get("NEO4J_USERNAME") or ""
    NEO4J_PASSWORD: str = os.environ.get("NEO4J_PASSWORD") or ""
    NEO4J_HOST: str = os.environ.get("NEO4J_HOST") or ""
    NEO4J_DB: str = os.environ.get("NEO4J_DB") or ""
    NEO4J_PORT: str = os.environ.get("NEO4J_PORT") or ""
    NEO4J_URI: str =os.environ.get("NEO4J_URI") or ""
    AURA_INSTANCENAME=os.environ.get("AURA_INSTANCENAME") or ""
    AURA_INSTANCEID=os.environ.get("AURA_INSTANCEID") or ""
