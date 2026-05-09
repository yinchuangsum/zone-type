# AGENTS.md

## Monorepo layout

- `frontend/` — Vue 3.5 + Vite SPA. See [frontend/AGENTS.md](frontend/AGENTS.md)
- `backend/` — NestJS API server. See [backend/AGENTS.md](backend/AGENTS.md)

The two projects are fully independent. Each has its own `package.json`, `node_modules`, and scripts. Always `cd` into the target directory before running commands.

## Commits & branches

- **Commit style**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`
- **Branch naming**: `feature/`, `fix/`, `docs/`, `refactor/`, `chore/` prefixes
