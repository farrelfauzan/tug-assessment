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

## Canonical References

When docs conflict, trust executable sources in this order:

1. Backend API/OpenAPI: `apps/backend/openapi.yaml`
2. Backend runtime/auth rules: `apps/backend/src/**`
3. Data model: `apps/backend/prisma/schema.prisma`
4. Agent policy/scope rules: `AGENTS.md`

## Current Product Scope

- Admin portal: create wellness packages, view orders, view reviews.
- Mobile app: browse/list packages, create orders, create reviews.
- User-owned resources (orders/reviews): identity derived from JWT on backend.

## Admin Authentication Model

- Admin web now uses secure HTTP-only cookies for auth session transport.
- Backend sets/rotates auth cookies on `POST /auth/login` and `POST /auth/refresh`.
- Backend clears cookies on `POST /auth/logout`.
- Browser API client uses `withCredentials: true` and does not persist tokens in localStorage.
