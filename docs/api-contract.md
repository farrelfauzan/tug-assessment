# API Contract

## Canonical Source

- Generated OpenAPI file: `apps/backend/openapi.yaml`
- Runtime implementation: `apps/backend/src/**`

This document is a concise, human-readable contract for current behavior.

## Base URL

- Local default: `http://localhost:3001`

## Response Envelope

Success:

```json
{
  "success": true,
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "message": "...",
  "errors": [],
  "path": "...",
  "timestamp": "...",
  "requestId": "..."
}
```

## Authentication Transport

Supported authentication inputs (backend):

- `Authorization: Bearer <accessToken>`
- `accessToken` cookie (HTTP-only cookie flow)

Admin web client uses cookie-based session transport (`withCredentials: true`).
Mobile client uses bearer token headers.

## Roles and Scope

### `ADMIN`

- Wellness packages: list/detail/create/update/delete
- Orders: list/detail/status update
- Reviews: list

### `USER` (mobile app)

- Wellness packages: list/detail
- Orders: create, list own, detail own
- Reviews: create, list own

## Ownership Rule

- For user-created actions (`POST /orders`, `POST /reviews`), backend derives actor from JWT.
- Client body `userId` is not trusted for ownership.

## Endpoint Matrix

### Auth

- `POST /auth/login` (public)
- `POST /auth/refresh` (public; body token or refresh cookie)
- `POST /auth/logout` (authenticated)

### Wellness Packages

- `GET /wellness-packages` (`ADMIN`, `USER`)
- `GET /wellness-packages/:id` (`ADMIN`, `USER`)
- `POST /wellness-packages` (`ADMIN`)
- `PATCH /wellness-packages/:id` (`ADMIN`)
- `DELETE /wellness-packages/:id` (`ADMIN`)

### Orders

- `POST /orders` (`USER`)
- `GET /orders` (`ADMIN`, `USER` -> own only)
- `GET /orders/:id` (`ADMIN`, `USER` -> own only)
- `PATCH /orders/:id/status` (`ADMIN`)

### Reviews

- `POST /reviews` (`USER`)
- `GET /reviews` (`ADMIN`, `USER` -> own only)
- `PATCH /reviews/:id` (`ADMIN`)
- `DELETE /reviews/:id` (`ADMIN`)

## Notes

- API versioning is currently unversioned path-based (`/`); plan a `/v1` strategy before external/public release.
- If this file and generated OpenAPI differ, treat `apps/backend/openapi.yaml` as authoritative.
