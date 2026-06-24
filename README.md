# Tug Assessment

Monorepo implementation for a wellness package management system with:

- NestJS backend API
- Next.js admin portal
- Expo mobile app

## What Is Implemented So Far

- Auth with JWT access/refresh tokens
- Role-based access control (`ADMIN`, `USER`)
- Wellness packages module
- Orders module
- Reviews module
- Admin scope: create packages, view orders, view reviews
- Mobile scope: browse packages, create orders, create reviews
- Request tracing via `x-request-id` in backend logs/errors

## Monorepo Workspace

- Package manager: `pnpm`
- Apps:
  - `apps/backend`
  - `apps/admin`
  - `apps/mobile`
- Shared libs:
  - `libs/api-schemas` (Zod contracts)
  - `libs/utils`

## Prerequisites

- Node.js (LTS)
- pnpm `9.x`
- PostgreSQL

## Environment Setup

### Backend (`apps/backend`)

Required values:

- `DATABASE_URL`
- `JWT_SECRET`

Optional:

- `PORT` (client defaults expect backend at `3001`)

### Admin (`apps/admin`)

Optional public API URL:

- `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`)

### Mobile (`apps/mobile`)

Configured in `apps/mobile/app.json`:

- `expo.extra.apiUrl`
- default is `http://10.0.2.2:3001` (Android emulator loopback)

## Installation

```bash
pnpm install
```

## Database Setup

Run migration and seed from backend:

```bash
pnpm --filter backend prisma:migrate
pnpm --filter backend prisma:seed
```

Seeded accounts:

- Admin: `admin@example.com` / `Admin123!`
- Mobile user: `user@example.com` / `User123!`

## Run the Apps

Start each app individually:

```bash
pnpm --filter backend dev
pnpm --filter admin dev
pnpm --filter mobile dev
```

Or run workspace dev in parallel:

```bash
pnpm dev
```

## Useful Commands

Workspace-level:

```bash
pnpm -r lint
pnpm -r typecheck
pnpm -r test
pnpm -r build
```

Backend-specific:

```bash
pnpm --filter backend test
pnpm --filter backend test:e2e
pnpm --filter backend openapi:generate
```

## API and Auth Notes

- Swagger UI is served by backend at `/api`.
- Generated contract file: `apps/backend/openapi.yaml`.
- Ownership rule: backend derives actor identity from JWT (`request.user`) for user-created resources.
- Admin web auth transport uses HTTP-only cookies (`withCredentials: true`), not localStorage tokens.
- Mobile uses bearer token headers from session state.

## Canonical References

When docs conflict, trust executable sources in this order:

1. Backend API/OpenAPI: `apps/backend/openapi.yaml`
2. Backend runtime/auth rules: `apps/backend/src/**`
3. Data model: `apps/backend/prisma/schema.prisma`
4. Agent policy and rules: `AGENTS.md`

## Docs Index

- Core engineering rules: `AGENTS.md`
- Architecture: `docs/architecture.md`
- API contract (human-readable summary): `docs/api-contract.md`
- Repository layout: `docs/repository.md`
- Database notes: `docs/database.md`
- Decisions log: `docs/decisions.md`
- Implementation task plan: `docs/implementation-plan.md`
- AI workflow log: `docs/ai-workflow.md`
- Code review snapshot: `docs/code-review.md`
- Admin UI fix notes: `docs/admin-panel-ui-fixes.md`

## Troubleshooting

- `403` when mobile creates order:
  - make sure you are logged in as `USER` (`user@example.com`), not admin.
- `400` on create order after schema changes:
  - restart backend so latest workspace libs/build outputs are loaded.
- Mobile cannot reach backend:
  - verify `apps/mobile/app.json` `expo.extra.apiUrl` points to your reachable backend host.
