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
