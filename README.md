# Inventory App

[![CI](https://github.com/jmpangilinan/inventory-app/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/jmpangilinan/inventory-app/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jmpangilinan/inventory-app/branch/develop/graph/badge.svg)](https://codecov.io/gh/jmpangilinan/inventory-app)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jmpangilinan_inventory-app&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jmpangilinan_inventory-app)
[![Vercel](https://img.shields.io/badge/vercel-deployed-brightgreen?logo=vercel)](https://inventory-app-puce-nine.vercel.app)

A full-stack inventory and stock management frontend built with Next.js 16, consuming the [Inventory API](https://github.com/jmpangilinan/inventory-api) Laravel backend.

## Features

- **Products** — full CRUD with search, pagination, and detail page
- **Categories** — full CRUD with client-side filtering
- **Stock Transactions** — per-product transaction history and recording
- **Audit Logs** — read-only trail of all resource changes with resource filter
- **Dashboard** — stat cards, low stock alerts, and recent activity feed
- **Authentication** — token-based login with auto-redirect on session expiry

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| API Client | Orval (generated from OpenAPI spec) |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form + Zod |
| Runtime | Bun |
| Linting | Biome |
| Testing | Vitest + Playwright |
| Coverage | Codecov + SonarCloud |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.x
- Access to the [Inventory API](https://inventory-api-production-8530.up.railway.app)

### Installation

```bash
bun install
```

### Environment Variables

Copy `.env.example` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Inventory API |
| `AUTH_SECRET` | Secret for auth token encryption (generate with `openssl rand -base64 32`) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking (optional) |

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
bun dev                  # Start dev server (Turbopack)
bun build                # Production build
bun lint                 # Biome lint + format check
bun format               # Biome auto-format
bun run test             # Unit tests (Vitest)
bun run test:coverage    # Unit tests with coverage report
bun test:e2e             # Playwright E2E tests
bun api:generate         # Regenerate Orval API client from OpenAPI spec
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login page
│   └── (dashboard)/      # Protected dashboard pages
├── components/
│   ├── ui/               # shadcn/ui base components
│   └── shared/           # Reusable app-level components
├── features/             # Feature-sliced modules
│   ├── products/
│   ├── categories/
│   ├── stock-transactions/
│   ├── audit-logs/
│   └── dashboard/
├── api/                  # Orval-generated API client (do not edit manually)
├── hooks/                # Custom hooks
├── stores/               # Zustand stores
├── lib/                  # Utilities and helpers
└── env.ts                # Validated environment variables (t3-env)
```

## CI/CD

Every PR to `develop` runs:

- Biome lint and TypeScript typecheck
- Vitest unit tests with coverage (80% threshold)
- SonarCloud quality gate
- Codecov patch coverage check
- Playwright E2E tests (Chromium)

Passing `develop` is deployed to a Vercel preview. Merging to `main` triggers production deployment.

## API

The frontend consumes the [Inventory API](https://github.com/jmpangilinan/inventory-api) — a Laravel REST API with repository/service pattern, domain events, HMAC device webhooks, and audit trail.

API client code is generated automatically from the OpenAPI spec using Orval. Never edit files in `src/api/` manually — run `bun api:generate` after any backend schema change.
