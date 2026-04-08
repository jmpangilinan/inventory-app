# inventory-app

Next.js 16 frontend for the inventory-api Laravel backend.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui + React Bits + next-themes + Sonner
- **API Client**: Orval (generated from OpenAPI spec)
- **Server State**: TanStack Query v5
- **Client State**: Zustand v5
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod
- **Auth**: Auth.js v5
- **Env**: t3-env
- **Dates**: date-fns
- **URL State**: nuqs
- **Runtime**: Bun
- **Linting/Formatting**: Biome
- **Testing**: Vitest + Storybook 9 + Playwright
- **Coverage**: @vitest/coverage-v8 + Codecov + SonarCloud
- **Monitoring**: Sentry + Vercel Analytics
- **Deployment**: Vercel

## Branching Strategy

```
main
  └── develop
        ├── feature/<name>
        ├── fix/<name>
        └── chore/<name>
```

- All work branches off `develop`
- Feature/fix/chore branches PR into `develop`
- `develop` PRs into `main` only when stable
- Squash merge: feature → develop
- Merge commit: develop → main
- Branch protection on both `main` and `develop` — CI must pass before merge

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product search filter
fix: correct stock calculation on edit
chore: update dependencies
refactor: extract inventory table hook
test: add unit tests for stock service
docs: update API usage notes
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Auth-gated routes
│   └── (dashboard)/      # Dashboard routes
├── components/
│   ├── ui/               # shadcn/ui base components (do not modify directly)
│   └── shared/           # Reusable app-level components
├── features/             # Feature-sliced modules
│   ├── inventory/
│   ├── products/
│   └── reports/
├── api/                  # Orval-generated API client (do not edit manually)
├── hooks/                # Custom hooks
├── stores/               # Zustand stores
├── lib/                  # Utilities, helpers, constants
├── types/                # Shared TypeScript types
└── env.ts                # t3-env validated environment variables
```

## Coding Standards

### General
- Strict TypeScript — no `any`, no `@ts-ignore` without explanation
- Prefer server components by default; use `"use client"` only when necessary
- Keep components small and single-responsibility
- Co-locate tests with the files they test (`foo.test.ts` next to `foo.ts`)

### API
- Never write API client code manually — regenerate from Orval
- Run `bun run api:generate` after any backend schema change
- All API calls go through TanStack Query hooks (no raw fetch in components)

### State
- Server state → TanStack Query
- URL/filter state → nuqs
- Global UI state → Zustand
- Local component state → `useState`
- Never use Zustand for server data

### Forms
- All forms use React Hook Form + Zod schema
- Define Zod schemas in `lib/validations/`
- Reuse schemas between form validation and API types where possible

### Styling
- Tailwind utility classes only — no custom CSS unless absolutely necessary
- Use `cn()` utility for conditional class merging
- Dark mode via `next-themes` — all components must support both modes

### Error Handling
- Use Sentry for unexpected errors in production
- Use Sonner toasts for user-facing feedback (success, error, info)
- Never silently swallow errors

## Testing Standards

- **Unit tests**: All utility functions and hooks must have unit tests
- **Component tests**: All shared components must have a Storybook story
- **E2E tests**: All critical user flows must have a Playwright test
- **Coverage thresholds** (enforced in CI):
  - Lines: 80%
  - Functions: 80%
  - Branches: 70%

## Environment Variables

All env vars are validated via `t3-env`. Adding a new variable requires:
1. Adding it to `env.ts` schema
2. Adding it to `.env.example`
3. Adding it to Vercel project settings

```
NEXT_PUBLIC_API_URL=https://inventory-api-production-8530.up.railway.app
```

## CI Pipeline

Every PR to `develop` must pass:
- Biome lint + format check
- TypeScript type check
- Vitest unit tests + coverage thresholds
- SonarCloud quality gate
- Playwright E2E (against Vercel preview URL)

## Commands

```bash
bun dev                  # Start dev server
bun build                # Production build
bun lint                 # Run Biome linter
bun format               # Run Biome formatter
bun test                 # Run Vitest
bun test:coverage        # Run Vitest with coverage
bun test:e2e             # Run Playwright
bun api:generate         # Regenerate Orval API client
bun storybook            # Start Storybook
```
