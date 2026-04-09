> **Branch rule**: `feature/*` or `fix/*` → `develop` only. Never target `main` directly.

## What changed and why
<!-- Describe the change and its motivation. Not how — the code shows that. -->


## Type
- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — no behavior change
- [ ] `test` — tests only
- [ ] `chore` — config, deps, tooling

## How to test locally
<!-- Steps to verify this works on a local machine -->
```
bun dev
# then...
```

## Test plan
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manually verified locally

## Screenshots
<!-- UI changes: attach before/after. Delete section if not applicable. -->

## Security
- [ ] No hardcoded secrets or credentials
- [ ] User input is validated (Zod schema)
- [ ] Auth/permissions not bypassed
- [ ] No new dependencies with known vulnerabilities

## Breaking changes
<!-- Does this change any API contracts, env vars, or shared types? -->
- [ ] No breaking changes
- [ ] Yes — describe migration steps below:

## AI assistance
- [ ] No AI-generated code
- [ ] AI-assisted — reviewed and verified all output before committing

## Checklist
- [ ] Commits follow conventional commits (`feat:`, `fix:`, `chore:` etc.)
- [ ] No `any` types introduced
- [ ] New env vars added to `.env.example` and `src/env.ts`
- [ ] API client not written manually — used `bun api:generate`
