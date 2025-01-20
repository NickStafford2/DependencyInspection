FROM ubuntu:22.04 as base

#avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install Packages
RUN apt-get update && apt-get install -y \
  build-essential \
  curl\
  git\
  python3.12.5 \
  python3.12.5-dev \
  python3.12.5-venv \
  python3-pip \
  && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12.5 1 

# Install Poetry
ENV POETRY_VERSION=1.4.2 

RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH ="/root/.local/bin:$PATH"

# Configure Poetry
RUN poetry config virtualenvs.create false

# set working directory
WORKDIR /app

# Copy only pyproject.toml first to cache dependencies
COPY pyproject.toml ./

RUN poetry lock && poetry install --no-root



FROM base as development
# install development tools
RUN apt-get update && apt-get install -y \
  vim \
  git \
  && rm -rf /var/lib/apt/lists/*

# copy the rest of the application
COPY dependencyinspection dependencyinspection

# install the root package
RUN poetry install

#listen to port 5001 at runtime
EXPOSE 5001

# Define our command to be run when launching the container
CMD poetry run hypercorn dependencyinspection.asgi:app -b 0.0.0.0:5001 --reload

FROM base as production
# Copy the rest of the application 
COPY dependencyinspection dependencyinspection/

# Install the root package 
RUN poetry install 

# Listen to port 5001 at runtime
EXPOSE 5001 

# Define our command to be run when launching the container 
CMD poetry run hypercorn dependencyinspection.asgi:app -b 0.0.0.0:5001 


