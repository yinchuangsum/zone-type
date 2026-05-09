# AGENTS.md — Backend

## Commands

| Command | What it does |
|---------|-------------|
| `npm run start:dev` | NestJS in watch mode at localhost:3000 |
| `npm run start:prod` | Production mode (`node dist/main`) |
| `npm run build` | `nest build` — compile to dist/ |
| `npm run test` | Jest unit tests (`src/**/*.spec.ts`) |
| `npm run test:e2e` | Jest e2e tests (`test/*.e2e-spec.ts`) |
| `npm run lint` | ESLint with `--fix` (includes prettier plugin) |
| `npm run format` | Prettier standalone (`src/**/*.ts`, `test/**/*.ts`) |

## Database

- **TypeORM with `synchronize: true`** — schema auto-syncs from entity definitions. No migrations. Restart the dev server after entity changes.
- **Default: SQLite** via `better-sqlite3`. File at `zone-type.sqlite` (gitignored).
- **PostgreSQL**: set `DB_TYPE=postgres` and configure host/port/credentials in `.env`.

## API

All routes are prefixed with `/api` (set via `app.setGlobalPrefix('api')` in `main.ts`).

## DTO validation

`ValidationPipe` in `main.ts` has:
- `whitelist: true` — strips unknown properties
- `forbidNonWhitelisted: true` — throws 400 on unknown extra fields
- `transform: true` — auto-transforms payloads to DTO instances

Use `class-validator` decorators on request DTOs.

## NestJS conventions

- Module resolution: `nodenext` (requires explicit `.js` extensions in relative imports)
- Decorators enabled: `emitDecoratorMetadata: true`, `experimentalDecorators: true`
- Config via `@nestjs/config` loading `.env` globally

## Code style

- **Prettier**: `singleQuote: true`, `trailingComma: "all"`
- **ESLint**: flat config in `eslint.config.mjs` — `typescript-eslint` with type-checked rules + prettier plugin
- `npm run lint` fixes both ESLint and Prettier issues
- `npm run format` runs Prettier standalone for formatting-only passes

## Env

`.env` exists locally and is gitignored. Template at `.env.example`. Key vars:
- `DB_TYPE` — `sqlite` (default) or `postgres`
- `JWT_SECRET` — signing key
- `JWT_EXPIRATION` — token TTL (e.g. `1d`)

## Testing

- **Unit**: `src/**/*.spec.ts`, run `npm run test`
- **E2E**: `test/*.e2e-spec.ts`, run `npm run test:e2e`
- Jest config is inline in `package.json`; e2e overrides at `test/jest-e2e.json`
