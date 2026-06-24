# Tug Assessment

Monorepo for the wellness package management assessment.

## Workspace

- Package manager: `pnpm`
- Apps: `apps/backend`, `apps/admin`, `apps/mobile`
- Shared libraries: `libs/api-schemas`, `libs/utils`

## Run

Install dependencies:

```bash
pnpm install
```

Start each app:

```bash
pnpm --filter backend dev
pnpm --filter admin dev
pnpm --filter mobile dev
```

Run workspace checks:

```bash
pnpm -r lint
pnpm -r typecheck
pnpm -r test
```
