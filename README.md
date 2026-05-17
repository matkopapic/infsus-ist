# Infsus IST

Project is split into two parts:

- `frontend` - React + Vite
- `backend` - NestJS + PostgreSQL

## Requirements

- Node.js
- npm
- PostgreSQL

## Backend

Env file goes here:

`backend/.env`

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=infsus_ist
DB_USERNAME=postgres
DB_PASSWORD=
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false
```

Install:

```bash
cd backend
npm install
```

Run in dev mode:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Swagger:

`http://localhost:5000/api/docs`

## Frontend

Env file goes here:

`frontend/.env`

Example:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Install:

```bash
cd frontend
npm install
```

Run in dev mode:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Database

Schema files are in:

`backend/src/database/schema/`

Main files:

- `database.sql`
- `seed.sql`

Create the database, run `database.sql`, then run `seed.sql`.

## Test

Backend unit tests:

```bash
cd backend
npm test
```

Backend e2e tests:

```bash
npm run test:e2e
```

Frontend tests:

```bash
cd frontend
npm test
```
