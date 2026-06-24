# Repository Structure

## Canonical Note

This document summarizes the current repository layout.
For exact truth at any time, use filesystem and executable configs.

## Top-Level Layout

```text
tug-assessment/
  apps/
    backend/
    admin/
    mobile/
  libs/
    api-schemas/
    utils/
  docs/
  AGENTS.md
  README.md
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
```

## Apps

### Backend (`apps/backend`)

- Framework: NestJS
- Data: Prisma + PostgreSQL
- Key paths:
  - `src/features/*` -> feature modules (controller/service/repository/api)
  - `src/shared/*` -> auth, guards, decorators, filters, interceptors, prisma
  - `src/test/e2e/*` -> endpoint e2e specs
  - `prisma/schema.prisma` -> canonical DB model
  - `openapi.yaml` -> generated API contract

### Admin (`apps/admin`)

- Framework: Next.js App Router
- Key paths:
  - `app/(auth)` -> login flow
  - `app/(dashboard)` -> packages/orders/reviews pages
  - `features/*/services` -> API-facing service modules
  - `lib/api.ts` -> centralized Axios client

### Mobile (`apps/mobile`)

- Framework: Expo + React Navigation
- Key paths:
  - `src/navigation/*` -> stacks/tabs/root
  - `src/features/*/screens` -> screen implementations
  - `src/features/*/services` -> API adapters
  - `src/services/api.ts` -> centralized Axios client

## Shared Libraries

### `libs/api-schemas`

- Shared Zod schemas and inferred types used by backend/admin/mobile.

### `libs/utils`

- Shared utility functions (pagination, formatting, constants).

## Current Product Scope Mapping

- Admin: create wellness packages, view orders, view reviews.
- Mobile: browse packages, create orders, create reviews.

## Recommended Investigation Order

1. `AGENTS.md`
2. `README.md`
3. `apps/backend/openapi.yaml`
4. `apps/backend/prisma/schema.prisma`
5. `apps/**/package.json` scripts and runtime files
