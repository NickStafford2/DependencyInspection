from quart import Blueprint

bp = Blueprint("migrations", __name__)

from dependencyinspection.migrations import main
