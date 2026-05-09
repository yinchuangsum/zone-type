# AGENTS.md — Frontend

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server at localhost:5173 |
| `npm run build` | `vue-tsc -b && vite build` — typecheck then bundle |
| `npm run preview` | Preview production build |

No separate `lint` or `typecheck` script. TypeScript checking runs as part of `build` via `vue-tsc -b`.

## Path alias

`@/` maps to `src/`. Configured in `vite.config.ts`, `tsconfig.json`, and `tsconfig.app.json`.

## shadcn-vue

Components live in `src/components/ui/`. Add new ones:

```bash
npx shadcn-vue@latest add <component-name>
```

Config: `components.json` (Lyra style, Olive theme, lucide icons).

## Tailwind CSS v4

No tailwind.config file. CSS-first config via `src/style.css`:
- `@import "tailwindcss"` for the framework
- `@theme inline { ... }` for design tokens
- `@custom-variant dark (&:is(.dark *));` for dark mode

## TypeScript

Uses TypeScript ~6.0 with `erasableSyntaxOnly: true`. All type-only imports must use the `type` keyword:

```ts
import type { Foo } from './foo'
import { type Bar } from './bar'
```

## Env

`VITE_API_BASE_URL` — backend URL (default `http://localhost:3000`). Accessed via `import.meta.env.VITE_API_BASE_URL`. Create `.env` manually (no `.env.example` in this directory).

## WPM / Typing analytics

- `useTypingGame` — real-time game state; WPM is a `computed()` that updates every keystroke: `correctChars / 5 / elapsedMinutes`.
- `useTypingAnalytics` — session-wide per-key stats, bigram/trigram timings, and throttled WPM. Uses `useIntervalFn` from VueUse (500ms interval). `rawWpm = keystrokes / 5 / minutes`, `netWpm = max(0, rawWpm - (uncorrectedErrors / minutes))` — penalizes errors.
