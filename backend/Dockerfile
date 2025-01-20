FROM ubuntu:22.04 AS base

#avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install Packages
RUN apt-get update && apt-get install -y \
  build-essential \
  curl\
  git\
  # python3.12.5 \
  # python3.12.5-dev \
  # python3.12.5-venv \
  # python3-pip \
  wget\
  libffi-dev \
  gcc \
  tcl-dev \
  tk-dev \
  uuid-dev \
  lzma-dev \
  liblzma-dev \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy the requirements file to the working directory
RUN mkdir /opt/python3.12.5

# To avoid .pyc files and save space
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


# Download Python source code from official site and build it
RUN wget -q https://www.python.org/ftp/python/3.12.5/Python-3.12.5.tgz
RUN tar -zxvf Python-3.12.5.tgz
RUN cd Python-3.12.5 && ./configure --prefix=/opt/python3.12.5 && make && make install

# Delete the python source code and temp files
RUN rm Python-3.12.5.tgz
RUN rm -r Python-3.12.5/

# Now link it so that $python works
RUN ln -s /opt/python3.12.5/python3.12.5 /usr/bin/python
# RUN ln -s /opt/python3.12.5/bin/python3.12.5 /usr/bin/python

RUN update-alternatives --install /usr/bin/python3 python3 /opt/python3.12.5 1


# Install Poetry
ENV POETRY_VERSION=1.4.2 

# RUN curl -sSL https://install.python-poetry.org | python3 -
#
# ENV PATH ="/root/.local/bin:$PATH"
#
# # Configure Poetry
# RUN poetry config virtualenvs.create false
#
# # set working directory
# WORKDIR /backendApp
#
# # Copy only pyproject.toml first to cache dependencies
# COPY pyproject.toml ./
#
# RUN poetry lock && poetry install --no-root
#
#
#
FROM base AS development
# install development tools
RUN apt-get update && apt-get install -y \
  vim \
  git \
  && rm -rf /var/lib/apt/lists/*

# # copy the rest of the application
# COPY dependencyinspection dependencyinspection
#
# # install the root package
# RUN poetry install
#
# #listen to port 5001 at runtime
# EXPOSE 5001
#
# # Define our command to be run when launching the container
# CMD poetry run hypercorn dependencyinspection.asgi:app -b 0.0.0.0:5001 --reload
#
# FROM base AS production
# # Copy the rest of the application 
# COPY dependencyinspection dependencyinspection/
#
# # Install the root package 
# RUN poetry install 
#
# # Listen to port 5001 at runtime
# EXPOSE 5001 
#
# # Define our command to be run when launching the container 
# CMD poetry run hypercorn dependencyinspection.asgi:app -b 0.0.0.0:5001 
#

