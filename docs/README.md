# DependencyInspection

DependencyInspection is a full-stack web application for analyzing JavaScript package dependencies and visualizing them as graphs. The system is designed as a containerized micro-stack with a Python backend, modern frontend build pipeline, graph database, and production-grade reverse proxy.

The project emphasizes:

* Clear separation of concerns (frontend, backend, database, ingress)
* Containerized deployment with Docker Compose
* HTTPS routing via Traefik
* Persistent Neo4j storage
* Local development with Poetry + Quart
* Production ASGI serving via Hypercorn

---

## High-Level Architecture

The application runs as four primary services:

* Reverse Proxy: Traefik
  Handles HTTPS, domain routing, and TLS certificates (Let’s Encrypt).

* Frontend: Vite + Nginx
  Frontend is built with Vite and served as static assets via Nginx.

* Backend: Quart + Hypercorn
  Python ASGI application served with Hypercorn.

* Database: Neo4j
  Graph database for dependency relationships, persisted to host storage.

Traffic flow:

* `https://dependencyinspection.com/` → frontend (Nginx)
* `https://dependencyinspection.com/api/*` → backend (Quart / Hypercorn)

Routing and TLS are managed entirely by Traefik.

---

## Repository Structure

```
DependencyInspection/
├── backend/                 # Quart backend + Dockerfile
├── frontend/                # Vite frontend + Dockerfile
├── docker-compose.yml       # Production stack
├── traefik.yaml             # Static Traefik config
├── traefik_dynamic.yaml     # Routing rules
├── neo4j_auth.txt           # Neo4j credentials (Docker secret)
└── docs/
```

---

## Backend

The backend is a Quart application, served in production via Hypercorn:

```
hypercorn dependencyinspection.asgi:app
```

Configuration is handled using Dynaconf:

* `settings.toml` defines environments:

  * default
  * development
  * docker

Docker sets:

```
ENV_FOR_DYNACONF=docker
```

which activates the `[docker]` section for production.

Local development uses Poetry:

```
poetry install
poetry run quart run --reload
```

---

## Frontend

The frontend is built using Vite.

During Docker build, the backend address is injected:

```
VITE_APP_BACKEND_ADDRESS=http://backend-service:5001/
```

The compiled frontend is then served by Nginx.

---

## Database (Neo4j)

Neo4j runs as a container with host-mounted persistence:

```
/home/nick/neo4j/data
/home/nick/neo4j/logs
/home/nick/neo4j/config
```

Credentials are provided via Docker secrets using `neo4j_auth.txt`.

This ensures database state survives container rebuilds.

---

## Reverse Proxy / TLS

Traefik handles:

* HTTPS termination
* Automatic Let’s Encrypt certificates
* Path-based routing
* Docker service discovery

Certificates are stored in a Docker volume:

```
letsencrypt
```

Traefik configuration is split into:

* `traefik.yaml` (static config)
* `traefik_dynamic.yaml` (routers + services)

---

## Local Development

Backend:

```
cd backend
poetry install
poetry run quart run --reload
```

Frontend:

```
cd frontend
npm install
npm run dev
```

Neo4j can be run locally or via Docker depending on preference.

---

## Production Deployment

Production runs directly on a VPS using Docker Compose.

Typical deployment flow:

```
ssh into server
cd ~/DependencyInspection
git pull
docker compose up -d --build
```

Docker builds the frontend and backend images locally on the VPS.

Persistent data (Neo4j + TLS certs) is preserved across rebuilds.

---

## Health Checks

* Backend exposes `/healthcheck`
* Docker Compose waits for Neo4j before starting backend
* Frontend waits for backend before starting

---

## Notes on Operations

* Docker image layers and logs can accumulate over time.
* Periodic cleanup is recommended:

```
docker system prune -af
```

Neo4j storage lives outside containers and is not affected by image cleanup.

---

