# Nest Bookings (minimal)

Features:
- REST: create, get by id, list upcoming/past (paginated)
- JWT auth (roles: provider/admin)
- Redis + WebSockets to broadcast `booking.created`
- BullMQ reminder job 10 min before start
- PostgreSQL schema + migrations
- Health check `/health` + Prometheus `/metrics`
- Tests: 2 unit, 1 e2e (happy path with SQLite)
- Dockerfile + docker-compose

## Assumptions & Decisions

- **Domain scope** kept minimal: one provider, simple booking lifecycle (no multi-staff, no recurring bookings).
- **Auth**: JWT with roles `provider` and `admin`. No refresh tokens for now.
- **Persistence**: PostgreSQL with TypeORM migrations.
- **Async jobs**: Redis + BullMQ for reminders and events.
- **Real-time**: WebSocket gateway emits `booking.created`.
- **Health & metrics**: Basic health check endpoint + Prometheus metrics.
- **Testing**: Included unit tests (service) and an end-to-end happy-path test (create + fetch).
- **Infra**: Dockerfile and docker-compose for DB + Redis + app.

## Run (Docker)
```
docker-compose up --build
```

## Local Dev
```
npm install
npm run migrate:run
npm run start:dev
```

## Test
```
npm test
npm run test:e2e
```

## What I’d Improve with +4 Hours

Add Swagger/OpenAPI docs for easier exploration.
Add role-based RBAC decorators instead of manual role checks.
Improve reminder job reliability (retries, dead-letter queues).
More comprehensive test coverage (failure cases, auth, pagination).
Observability: structured logging + distributed tracing.
CI pipeline for lint/test/build on PRs.
