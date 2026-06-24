# AGENTS.md

Engineering handbook for AI agents working in this project.

---

## INVESTIGATION ORDER

Read these in order when investigating:

1. `AGENTS.md` (this file)
2. Root `README.md`
3. Root `package.json` / workspace config
4. Lockfile (`pnpm-lock.yaml`, `yarn.lock`, or `package-lock.json`)
5. Build/test/lint/typecheck configs
6. Existing instruction files (`.opencode/`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`)

**Trust executable sources over prose.** If docs conflict with config or scripts, trust the executable source.

---

## MONOREPO STRUCTURE

**pnpm Workspace**

- Use pnpm as the package manager and workspace runner
- Structure: `apps/` for applications, `libs/` for shared code
- Each app: `backend/`, `admin/`, `mobile/`
- Shared code: `libs/` (API schemas, utilities, components)

**Rules:**
- Apps are independent, libs are reusable
- Never import from apps in other apps
- libs can depend on other libs, not vice versa
- Use `pnpm --filter <project> <command>` to run commands on specific projects
- Use `pnpm -r <command>` to run commands across all projects

---

## ARCHITECTURE

### Feature-Based Clean Architecture

Each feature directory must contain:

```
feature/
├── api/          # DTOs, OpenAPI specs
├── components/   # Reusable UI components
├── pages/        # Page routes (Admin) or screens (Mobile)
├── services/     # Business logic
├── repositories/ # Data access layer
├── hooks/        # Custom hooks
├── schemas/      # Zod schemas (single source of truth)
├── types/        # TypeScript types (infer from Zod when possible)
└── tests/        # Unit/integration tests
```

**Rules:**
- Business logic NEVER in controllers/components
- Controllers handle HTTP concerns only (params, headers, status)
- Services contain business logic and coordinate repositories
- Repositories handle database operations only

---

## Zod SCHEMAS

**Zod is the single source of truth for validation and types.**

- Define schemas in `feature/schemas/`
- Infer TypeScript types: `type User = z.infer<typeof userSchema>`
- Use same schemas for backend validation, frontend forms, and mobile forms
- Generate OpenAPI from Zod schemas

**Never duplicate schemas.**

---

## DATABASE

**PostgreSQL + Prisma ORM**

- `schema.prisma` is the source of truth
- Use Prisma Migrate: `npx prisma migrate dev`
- Use Prisma Seed for initial data
- **Never use `npx prisma db push`**
- Add `createdAt` and `updatedAt` to all models
- Use enums for fixed value sets
- Add indexes for frequently queried fields
- Soft delete only if explicitly required

**Raw SQL is forbidden unless absolutely necessary.**

---

## BACKEND RULES

### Always

- Organize by feature modules (`FeatureModule`)
- Keep controllers thin (0 business logic)
- Put business logic in services
- Use dependency injection
- Validate requests with `nestjs-zod`
- Generate Swagger docs: `npx nestjs-swagger`
- Generate OpenAPI YAML and export it
- Serve Swagger UI at `/api`
- Use explicit typing (no implicit `any`)
- Centralize error handling with filters
- Use transactions for multi-step operations

### Never

- ❌ `class-validator` / `class-transformer`
- ❌ Business logic in controllers
- ❌ Direct Prisma access from controllers

---

## ADMIN PORTAL RULES

### Always

- Use Next.js App Router (`app/` directory)
- Use Tailwind CSS (configured) as styling foundation
- Use TanStack Query for server state
- Use TanStack Form for forms (@tanstack/react-form)
- Use Zod for form validation
- Use centralized Axios client for API calls
- Use shadcn/ui components as base
- Keep components reusable and small
- Separate UI from business logic
- Handle loading, empty, and error states explicitly
- Keep admin scope focused on internal operations:
  - Create wellness packages
  - View orders
  - View reviews

### Never

- ❌ React Hook Form (use TanStack Form)
- ❌ `fetch` directly (use Axios client)
- ❌ Duplicate API logic
- ❌ Unconfigured CSS stack for shadcn/ui (Tailwind must be set up)

---

## MOBILE APP RULES

### Always

- Use Expo for development
- Use React Navigation for routing
- Use TanStack Query for server state
- Use TanStack Form for forms (@tanstack/react-form)
- Use Zod for form validation
- Use Axios for API calls
- Separate screens from business logic
- Handle loading, empty, and error states
- Keep mobile scope focused on user actions:
  - Browse/list wellness packages
  - Create orders
  - Create reviews

### Never

- ❌ API calls inside presentation components

---

## API DESIGN

### REST Only

**Admin API:** `GET`, `POST`, `PATCH`, `DELETE`

**Mobile API:** `GET` for browsing and `POST` for user actions (order/review creation)

### Role Scope (Current Product Rules)

- `ADMIN`:
  - Wellness packages: create/update/delete, and list/detail
  - Orders: view all orders, update order status
  - Reviews: view all reviews
- `USER` (mobile app):
  - Wellness packages: list/detail
  - Orders: create order, view own orders
  - Reviews: create review, view own reviews

### Auth-bound Ownership

- Never trust `userId` from client body for user actions.
- For user-created resources (orders/reviews), derive actor identity from JWT (`request.user`).

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Failure:**
```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

### OpenAPI

- Generate from Zod schemas
- Export `openapi.yaml` to repository
- Keep documentation in sync with code

---

## CODE STYLE

### Always

- Follow SOLID principles
- Prefer composition over inheritance
- Keep files small (<200 lines where possible)
- Keep functions under 30 lines
- Avoid duplicated logic
- Avoid unnecessary abstractions
- **Never use `any`** (use `unknown` or explicit types)
- Prefer explicit typing
- Prefer readability over cleverness
- Use descriptive, self-documenting names

### Naming Conventions

- `PascalCase` for types, interfaces, classes
- `camelCase` for functions, variables, methods
- `kebab-case` for file names
- `SCREAMING_SNAKE_CASE` for environment variables

---

## TESTING

- Generate unit tests for services when appropriate
- Test business logic, not implementation details
- Mock dependencies (Prisma, external APIs)
- Aim for high coverage on core business logic

---

## DOCUMENTATION

**Every code generation must include:**

1. Architectural decisions and why
2. Trade-offs considered
3. Assumptions made
4. Suggested future improvements

---

## AI WORKFLOW

### Before Writing Code

1. Read `AGENTS.md` completely
2. Understand the architecture
3. Check existing patterns in similar features
4. Avoid inconsistent implementations

### When Implementing

1. Explain important decisions
2. Keep tasks small and focused
3. Avoid unrelated refactoring

### After Implementation

1. Review generated code
2. Identify potential bugs
3. Suggest improvements
4. Verify consistency with `AGENTS.md`

### Ambiguous Requirements

**State assumptions explicitly before implementation.**

---

## CRITICAL COMMANDS

| Task | Command |
|------|---------|
| Backend dev server | `pnpm --filter backend dev` |
| Admin dev server | `pnpm --filter admin dev` |
| Mobile dev server | `pnpm --filter mobile dev` |
| Prisma migrate | `npx prisma migrate dev` |
| Prisma seed | `npx prisma db seed` |
| Generate Swagger | `npx nestjs-swagger` |
| Lint | `pnpm -r lint` |
| Typecheck | `pnpm -r typecheck` |
| Test | `pnpm -r test` |

---

## GIT WORKFLOW

- Commit messages: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Branch naming: `feature/`, `fix/`, `refactor/`
- Use a dedicated feature branch for each implementation task (required)
- Recommended task branch format: `feature/task-<number>-<short-name>`
- Branch flow: create from `main` -> complete one task -> open PR -> merge
- Do not combine multiple tasks in one branch unless explicitly approved
- PR descriptions: Include context, changes, and testing steps

---

## TRAPS TO AVOID

1. **Duplicate schemas** → Always infer from Zod
2. **Business logic in controllers** → Move to services
3. **Direct Prisma in controllers** → Use repositories
4. **`db push` instead of migrations** → Always use `migrate dev`
5. **Using `any`** → Use explicit types or `unknown`
6. **Duplicate API logic** → Centralize in services/hooks
7. **React Hook Form** → Use TanStack Form
8. **Raw fetch** → Use Axios client
9. **Ignoring error states** → Always handle loading, empty, error

---

*Last updated: 2026-06-24*
