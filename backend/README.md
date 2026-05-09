# Zone Type — Backend

NestJS API server for the Zone Type application.

## Tech Stack

- **NestJS** — Progressive Node.js framework
- **TypeScript** — Type-safe development
- **TypeORM** — ORM with dual SQL support (SQLite / PostgreSQL)
- **Passport + JWT** — Stateless authentication
- **class-validator** — Request DTO validation

## Prerequisites

- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9

## Getting Started

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

## Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm run start:dev`  | Start backend in watch mode           |
| `npm run start:prod` | Start backend in production mode       |
| `npm run build`      | Build backend for production           |
| `npm run test`       | Run unit tests                        |
| `npm run test:e2e`   | Run end-to-end tests                  |
| `npm run lint`       | Lint and format code                  |

## Project Structure

```
backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module (TypeORM, Config, Auth)
│   ├── auth/
│   │   ├── auth.module.ts         # Auth module definition
│   │   ├── auth.controller.ts     # Auth endpoints
│   │   ├── auth.service.ts        # Auth logic (register, login, JWT)
│   │   ├── dto/
│   │   │   ├── register.dto.ts    # Registration request DTO
│   │   │   └── login.dto.ts       # Login request DTO
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts   # JWT authentication guard
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts     # Passport JWT strategy
│   │   └── decorators/
│   │       └── current-user.decorator.ts
│   ├── users/
│   │   ├── users.module.ts         # Users module definition
│   │   ├── users.service.ts        # User CRUD operations
│   │   └── entities/
│   │       └── user.entity.ts      # TypeORM User entity
│   └── common/
│       └── filters/
│           └── http-exception.filter.ts
├── test/
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth

| Method | Path            | Description                          |
| ------ | --------------- | ------------------------------------ |
| POST   | `/api/auth/register` | Register a new user              |
| POST   | `/api/auth/login`    | Login and receive a JWT token    |
| GET    | `/api/auth/me`       | Get current user profile (JWT protected) |

#### Register

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "typist",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "eyJhbGci..."
}
```

#### Login

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "eyJhbGci..."
}
```

#### Get Profile

```
GET /api/auth/me
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "typist",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

| Variable          | Description                    | Default                       |
| ----------------- | ------------------------------ | ----------------------------- |
| `DB_TYPE`         | Database type (`sqlite` / `postgres`) | `sqlite`              |
| `DB_DATABASE`     | SQLite file path or DB name    | `zone-type.sqlite`            |
| `DB_HOST`         | PostgreSQL host                | `localhost`                   |
| `DB_PORT`         | PostgreSQL port                | `5432`                        |
| `DB_USERNAME`     | PostgreSQL username            | `postgres`                    |
| `DB_PASSWORD`     | PostgreSQL password            | `postgres`                    |
| `PORT`            | Application port               | `3000`                        |
| `JWT_SECRET`      | Secret key for signing tokens  | —                             |
| `JWT_EXPIRATION`  | Token expiration time          | `1d`                          |

### Switching to PostgreSQL

Update your `.env`:

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=zone_type
```

## License

Private — All rights reserved.