FROM python:3.12.8-bookworm  AS base

RUN pip --no-cache-dir install poetry==2.0.1

ENV POETRY_NO_INTERACTION=1 \
  POETRY_VIRTUALENVS_IN_PROJECT=1 \
  POETRY_VIRTUALENVS_CREATE=1 \
  POETRY_CACHE_DIR=/tmp/poetry_cache
# set working directory
WORKDIR /app

# Copy only pyproject.toml first to cache dependencies
COPY pyproject.toml poetry.lock settings.toml ./
RUN touch README.md
RUN poetry install --no-root && rm -rf $POETRY_CACHE_DIR

ENV VIRTUAL_ENV=/app/.venv \
  PATH="/app/.venv/bin:$PATH"


FROM base AS development
# copy the rest of the application
COPY dependencyinspection dependencyinspection

#listen to port 5001 at runtime
EXPOSE 5001

# Define our command to be run when launching the container
CMD poetry run hypercorn dependencyinspection.asgi:app -b 0.0.0.0:5001 --reload


FROM base AS production
# Copy the rest of the application 
COPY dependencyinspection dependencyinspection/

# Listen to port 5001 at runtime
EXPOSE 5001 

# Define our command to be run when launching the container 
CMD poetry run hypercorn dependencyinspection.asgi:app -b 0.0.0.0:5001 


