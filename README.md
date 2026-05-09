# Zone Type

Full-stack web application built with a modern frontend and backend architecture.

## Tech Stack

### Frontend

- **Vue 3.5** — Composition API with `<script setup>`
- **Vite** — Fast build tool and dev server
- **TypeScript** — Type-safe development
- **SCSS** — CSS preprocessor for advanced styling
- **Tailwind CSS v4** — Utility-first CSS framework
- **shadcn-vue** — UI component library (Lyra style, Olive theme)

### Backend

- **NestJS** — Progressive Node.js framework
- **TypeScript** — Type-safe development
- **TypeORM** — ORM with dual SQL support
  - **SQLite** — Default database (zero-config, file-based, uses better-sqlite3)
  - **PostgreSQL** — Production-ready relational database
- **Passport + JWT** — Stateless authentication
- **class-validator** — Request DTO validation

## Project Structure

```
zone-type/
├── backend/            # NestJS API server
│   ├── src/
│   │   ├── auth/       # Auth module (register, login, JWT)
│   │   │   ├── dto/    # Request DTOs
│   │   │   ├── guards/ # JWT auth guard
│   │   │   ├── strategies/ # Passport strategies
│   │   │   └── decorators/ # Custom decorators
│   │   ├── users/      # Users module (entity, service)
│   │   ├── common/      # Shared utilities (filters, etc.)
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── ...
├── frontend/           # Vue 3.5 SPA
│   ├── src/
│   │   ├── assets/     # Static assets (images, fonts, global SCSS)
│   │   ├── components/ # Vue components
│   │   │   └── ui/     # shadcn-vue components
│   │   ├── composables/# Reusable composition functions
│   │   ├── lib/        # Utility functions (cn, etc.)
│   │   ├── views/      # Page-level components
│   │   ├── router/     # Vue Router configuration
│   │   ├── stores/     # Pinia state stores
│   │   ├── App.vue     # Root component
│   │   ├── main.ts     # Application entry point
│   │   └── style.css   # Global styles & theme variables
│   ├── components.json # shadcn-vue configuration
│   ├── vite.config.ts  # Vite build configuration
│   └── ...
├── README.md           # This file
└── .git/
```

## Prerequisites

- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9 or **pnpm** >= 8
- **Git** >= 2.40

## Getting Started

### Clone the Repository

```bash
git clone <repository-url> zone-type
cd zone-type
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend will be available at `http://localhost:3000`.

> **Note:** The backend uses SQLite by default. To switch to PostgreSQL, update the ORM configuration in the backend's `.env` file.

## Development

### Frontend Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start development server           |
| `npm run build`    | Build for production               |
| `npm run preview`  | Preview production build           |
| `npm run typecheck`| Run TypeScript type checking       |

### Backend Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run start:dev`  | Start backend in watch mode        |
| `npm run start:prod` | Start backend in production mode   |
| `npm run build`      | Build backend for production       |
| `npm run test`       | Run unit tests                     |
| `npm run test:e2e`   | Run end-to-end tests               |
| `npm run lint`       | Lint and format code               |

## Environment Variables

Create a `.env` file in each subfolder based on the corresponding `.env.example` file.

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (.env)

```env
# Database
DB_TYPE=sqlite
DB_DATABASE=zone-type.sqlite
# For PostgreSQL:
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=zone_type

# Application
PORT=3000

# Auth
JWT_SECRET=change-me-in-production
JWT_EXPIRATION=1d
```

## API Endpoints

All backend endpoints are prefixed with `/api`.

| Method | Path                    | Description                      |
| ------ | ----------------------- | -------------------------------- |
| POST   | `/api/auth/register`    | Register a new user              |
| POST   | `/api/auth/login`       | Login and receive a JWT token    |
| GET    | `/api/auth/me`          | Get current user profile (JWT)   |

## Theme Customization

The frontend uses a custom **Olive** color theme built on top of shadcn-vue's **Lyra** style. All theme tokens are defined as CSS variables in `frontend/src/style.css` under `:root` (light mode) and `.dark` (dark mode).

Key color tokens:

| Token     | Light Mode             | Dark Mode              | Usage                         |
| --------- | -----------------------| -----------------------| ----------------------------- |
| Primary   | `oklch(0.47 0.08 120)`| `oklch(0.72 0.08 120)`| Primary buttons, links, CTAs  |
| Accent    | `oklch(0.93 0.04 120)`| `oklch(0.27 0.04 120)`| Hover states, highlights      |

To modify the theme, edit the CSS variables in `frontend/src/style.css`. Refer to the [shadcn-vue theming docs](https://www.shadcn-vue.com/docs/theming) for the full list of tokens.

### Adding shadcn-vue Components

```bash
cd frontend
npx shadcn-vue@latest add <component-name>
```

Browse available components at [shadcn-vue.com](https://www.shadcn-vue.com/docs/components).

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "feat: add your feature"`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request against `main`

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, semicolons, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Build process, tooling, or dependency updates

### Branch Naming

- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation
- `refactor/` — Refactoring
- `chore/` — Maintenance tasks

## License

Private — All rights reserved.