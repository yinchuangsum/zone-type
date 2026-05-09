# Zone Type — Frontend

Single-page application built with Vue 3.5, Vite, TypeScript, SCSS, Tailwind CSS v4, and shadcn-vue.

## Tech Stack

| Technology    | Version | Purpose                            |
| ------------- | ------- | ---------------------------------- |
| Vue           | 3.5     | UI framework (Composition API)     |
| Vue Router    | 4.x     | Client-side routing & navigation    |
| Pinia         | latest  | State management                   |
| Vite          | 6.x     | Build tool & dev server             |
| TypeScript    | 5.x     | Type-safe development               |
| SCSS (Sass)   | —       | CSS preprocessor                     |
| Tailwind CSS  | v4      | Utility-first CSS framework          |
| shadcn-vue    | latest  | UI component library (Lyra style)    |
| Reka UI       | latest  | Headless UI primitives (shadcn base) |

## Prerequisites

- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command             | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start Vite dev server with HMR       |
| `npm run build`      | Type-check and build for production  |
| `npm run preview`    | Preview the production build locally |
| `npm run typecheck`  | Run Vue TSC type checking            |

## Project Structure

```
frontend/
├── public/                  # Static assets served as-is
├── src/
│   ├── assets/               # Images, fonts, global SCSS
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppNavbar.vue  # Top navigation bar
│   │   │   └── AppLayout.vue  # Shared page layout (navbar + router-view)
│   │   └── ui/               # shadcn-vue components
│   │       └── button/       # Button component
│   │           ├── Button.vue
│   │           └── index.ts
│   ├── composables/          # Reusable composition functions
│   ├── lib/
│   │   └── utils.ts          # Utility functions (cn)
│   ├── views/                # Page-level components (lazy-loaded)
│   │   ├── HomeView.vue       # Home page
│   │   └── ProfileView.vue   # Profile page
│   ├── router/
│   │   └── index.ts          # Vue Router config & route definitions
│   ├── stores/
│   │   ├── index.ts           # Pinia store initialization
│   │   └── user.ts            # User profile store
│   ├── App.vue               # Root component
│   ├── main.ts               # Application entry point
│   └── style.css             # Global styles & theme CSS variables
├── components.json           # shadcn-vue configuration
├── tsconfig.json              # TypeScript root config
├── tsconfig.app.json          # TypeScript app config (with @/ alias)
├── tsconfig.node.json         # TypeScript Node config
├── vite.config.ts             # Vite configuration
└── package.json
```

## Path Aliases

The `@/` alias maps to `src/`, configured in:

- `vite.config.ts` — Vite resolve alias
- `tsconfig.json` — TypeScript path mapping
- `tsconfig.app.json` — TypeScript app path mapping

```ts
// Instead of:
import Button from '../../../components/ui/button/Button.vue'

// Use:
import { Button } from '@/components/ui/button'
```

## Theme

The frontend uses a custom **Olive** color theme built on shadcn-vue's **Lyra** style. All design tokens are CSS variables defined in `src/style.css`.

### Color Scheme

Colors use the `oklch()` color space for perceptual uniformity. The primary and accent tokens use an olive hue (hue ≈ 120):

| Token               | `:root` (Light)            | `.dark`                     | Purpose                          |
| --------------------| --------------------------- | ----------------------------| -------------------------------- |
| `--primary`         | `oklch(0.47 0.08 120)`    | `oklch(0.72 0.08 120)`    | Primary actions, brand color     |
| `--primary-foreground` | `oklch(0.98 0.01 120)` | `oklch(0.15 0.03 120)`    | Text on primary backgrounds      |
| `--accent`          | `oklch(0.93 0.04 120)`    | `oklch(0.27 0.04 120)`    | Hover states, highlights         |
| `--accent-foreground` | `oklch(0.20 0.04 120)`  | `oklch(0.93 0.04 120)`    | Text on accent backgrounds       |
| `--secondary`       | `oklch(0.93 0.03 120)`    | `oklch(0.27 0.04 120)`    | Secondary actions                |
| `--muted`           | `oklch(0.93 0.03 120)`    | `oklch(0.27 0.04 120)`    | Subtle backgrounds               |

Full theme tokens are available in `src/style.css`. Refer to the [shadcn-vue theming docs](https://www.shadcn-vue.com/docs/theming) for token conventions.

### Dark Mode

Dark mode is controlled via the `.dark` class on the `<html>` or `<body>` element. All theme tokens have corresponding dark variants defined in `src/style.css`.

## Adding shadcn-vue Components

```bash
# Add a single component
npx shadcn-vue@latest add button

# Add multiple components
npx shadcn-vue@latest add button card dialog

# View available components
npx shadcn-vue@latest list @shadcn-vue
```

Components are placed in `src/components/ui/` and can be imported using the `@/` alias:

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button>Click me</Button>
</template>
```

Browse all available components at [shadcn-vue.com](https://www.shadcn-vue.com/docs/components).

## SCSS Usage

Global SCSS files can be placed in `src/assets/styles/` and imported in `main.ts` or `style.css`. Vue SFCs support scoped SCSS:

```vue
<style lang="scss" scoped>
.my-component {
  display: flex;
  gap: 1rem;

  &__title {
    font-weight: bold;
  }
}
</style>
```

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Access in code via `import.meta.env.VITE_API_BASE_URL`.

## Contributing

See the root [README](../README.md) for contribution guidelines.

## License

Private — All rights reserved.