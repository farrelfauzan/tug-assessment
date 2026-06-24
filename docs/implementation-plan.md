# Implementation Plan

This plan breaks the assessment into 18 atomic implementation tasks, prioritized for MVP delivery.

---

## Phase 1: Setup and Infrastructure (Tasks 1-4)

### Task 1: Initialize pnpm Workspace and Project Structure

**Objective**: Set up the monorepo structure with pnpm workspace.

**Duration**: 15 minutes

**Dependencies**: None

**Acceptance Criteria**:
- [ ] Root `package.json` with pnpm workspace configuration
- [ ] `pnpm-workspace.yaml` file
- [ ] `apps/backend/` directory with NestJS app
- [ ] `apps/admin/` directory with Next.js app
- [ ] `apps/mobile/` directory with Expo app
- [ ] `libs/` directory for shared code
- [ ] All apps run `dev` command successfully

---

### Task 2: Configure Shared Libraries

**Objective**: Create shared libraries for API schemas and utilities.

**Duration**: 20 minutes

**Dependencies**: Task 1

**Acceptance Criteria**:
- [ ] `libs/api-schemas/` with wellness package schemas
- [ ] `libs/utils/` with shared utilities
- [ ] TypeScript configuration for libs
- [ ] Schemas are exported and usable by all apps
- [ ] Type inference works from Zod schemas

---

### Task 3: Set Up Database and Prisma

**Objective**: Configure PostgreSQL and Prisma ORM.

**Duration**: 20 minutes

**Dependencies**: Task 1

**Acceptance Criteria**:
- [ ] PostgreSQL running locally or in Docker
- [ ] `schema.prisma` with all models
- [ ] Prisma client generated
- [ ] Environment variables configured
- [ ] Migration files generated
- [ ] Seed data created

---

### Task 4: Configure CI/CD Pipeline

**Objective**: Set up automated testing and linting.

**Duration**: 25 minutes

**Dependencies**: Tasks 1-3

**Acceptance Criteria**:
- [ ] GitHub Actions workflow for CI
- [ ] Linting runs on all projects
- [ ] Type checking runs on all projects
- [ ] Tests run on all projects
- [ ] Build step configured
- [ ] Pipeline fails on errors

---

## Phase 2: Backend Implementation (Tasks 5-10)

### Task 5: Implement Authentication Module

**Objective**: Create JWT-based authentication with login and refresh endpoints.

**Duration**: 30 minutes

**Dependencies**: Task 4

**Acceptance Criteria**:
- [ ] User entity with password hashing
- [ ] Login endpoint with JWT generation
- [ ] Refresh token endpoint
- [ ] Logout endpoint
- [ ] JWT guard for protected routes
- [ ] Auth service with business logic
- [ ] Auth controller with thin logic

---

### Task 6: Implement Wellness Packages Module

**Objective**: Create CRUD operations for wellness packages.

**Duration**: 30 minutes

**Dependencies**: Task 5

**Acceptance Criteria**:
- [ ] Wellness package entity
- [ ] List packages endpoint (paginated)
- [ ] Get package by ID endpoint
- [ ] Create package endpoint
- [ ] Update package endpoint
- [ ] Delete package endpoint
- [ ] Zod schemas for validation
- [ ] OpenAPI documentation

---

### Task 7: Implement Orders Module

**Objective**: Create order management system.

**Duration**: 30 minutes

**Dependencies**: Task 6

**Acceptance Criteria**:
- [ ] Order entity with relationships
- [ ] Create order endpoint (`USER`)
- [ ] List orders endpoint (`ADMIN` all, `USER` own)
- [ ] Get order by ID endpoint (`ADMIN` any, `USER` own)
- [ ] Update order status endpoint
- [ ] Order items entity
- [ ] Payment entity

---

### Task 8: Implement Reviews Module

**Objective**: Create review system for wellness packages.

**Duration**: 25 minutes

**Dependencies**: Task 7

**Acceptance Criteria**:
- [ ] Review entity
- [ ] Create review endpoint (`USER`)
- [ ] List reviews endpoint (`ADMIN` all, `USER` own)
- [ ] Update review endpoint
- [ ] Delete review endpoint
- [ ] Calculate average ratings

---

### Task 9: Implement Shared Concerns

**Objective**: Create guards, filters, interceptors, and decorators.

**Duration**: 25 minutes

**Dependencies**: Tasks 5-8

**Acceptance Criteria**:
- [ ] JWT authentication guard
- [ ] Global exception filter
- [ ] Logging interceptor
- [ ] Role-based authorization decorator
- [ ] Response transformation interceptor
- [ ] Validation pipe configuration

---

### Task 10: Generate OpenAPI Documentation

**Objective**: Generate and serve OpenAPI documentation.

**Duration**: 15 minutes

**Dependencies**: Tasks 5-9

**Acceptance Criteria**:
- [ ] OpenAPI YAML generated
- [ ] Swagger UI served at `/api`
- [ ] All endpoints documented
- [ ] Zod schemas used for validation
- [ ] OpenAPI exported to repository

---

## Phase 3: Admin Portal Implementation (Tasks 11-13)

### Task 11: Set Up Admin Portal Foundation

**Objective**: Configure Next.js App Router and core dependencies.

**Duration**: 20 minutes

**Dependencies**: Task 1

**Acceptance Criteria**:
- [ ] Next.js App Router configured
- [ ] TanStack Query set up
- [ ] TanStack Form set up
- [ ] Axios client configured
- [ ] shadcn/ui components installed
- [ ] Layout with navigation

---

### Task 12: Implement Authentication Pages

**Objective**: Create login, refresh, and logout pages.

**Duration**: 25 minutes

**Dependencies**: Task 11

**Acceptance Criteria**:
- [ ] Login page with form
- [ ] Login validation with Zod
- [ ] Token storage (httpOnly cookie)
- [ ] Redirect on success
- [ ] Error handling with toast
- [ ] Refresh token logic
- [ ] Logout functionality

---

### Task 13: Implement Admin Dashboard

**Objective**: Create wellness package and order management pages.

**Duration**: 30 minutes

**Dependencies**: Task 12

**Acceptance Criteria**:
- [ ] Dashboard layout with sidebar
- [ ] Wellness packages list page
- [ ] Wellness package create page
- [ ] Orders list page (view)
- [ ] Reviews list page (view)
- [ ] Loading, empty, and error states
- [ ] Toast notifications

---

## Phase 4: Mobile App Implementation (Tasks 14-16)

### Task 14: Set Up Mobile App Foundation

**Objective**: Configure Expo and core dependencies.

**Duration**: 20 minutes

**Dependencies**: Task 1

**Acceptance Criteria**:
- [ ] Expo app configured
- [ ] React Navigation set up
- [ ] TanStack Query configured
- [ ] TanStack Form configured
- [ ] Axios client configured
- [ ] React Native Paper installed

---

### Task 15: Implement Public Pages

**Objective**: Create wellness package browsing pages.

**Duration**: 25 minutes

**Dependencies**: Task 14

**Acceptance Criteria**:
- [ ] Package list screen
- [ ] Package detail screen
- [ ] Search functionality
- [ ] Package reviews screen
- [ ] Loading states
- [ ] Error handling
- [ ] Pull-to-refresh

---

### Task 16: Implement User Features

**Objective**: Create order and review functionality.

**Duration**: 30 minutes

**Dependencies**: Task 15

**Acceptance Criteria**:
- [ ] Order creation screen
- [ ] Order list screen
- [ ] Order detail screen
- [ ] Review creation screen
- [ ] User profile screen
- [ ] Toast notifications

---

## Scope Clarification (Post-implementation)

- Mobile app does not implement admin CRUD actions.
- Mobile app supports: package browsing, order creation, review creation.
- Admin portal supports: package creation, order viewing, review viewing.
- For user-created resources, backend derives actor from JWT and does not trust `userId` from request body.

---

## Phase 5: Testing and Polish (Tasks 17-18)

### Task 17: Write Unit Tests

**Objective**: Write unit tests for services and utilities.

**Duration**: 30 minutes

**Dependencies**: Tasks 5-10, 13, 16

**Acceptance Criteria**:
- [ ] Service tests for wellness packages
- [ ] Service tests for orders
- [ ] Service tests for reviews
- [ ] Service tests for authentication
- [ ] Repository mock tests
- [ ] Test coverage > 80%

---

### Task 18: Integration Testing and Bug Fixes

**Objective**: Write integration tests and fix bugs.

**Duration**: 30 minutes

**Dependencies**: Task 17

**Acceptance Criteria**:
- [ ] E2E tests for admin portal
- [ ] E2E tests for mobile app
- [ ] API contract tests
- [ ] All bugs fixed
- [ ] Performance optimized
- [ ] Documentation updated

---

## Optional Bonus Tasks

### Bonus Task 1: Add Email Notifications

**Objective**: Implement email notifications for order status changes.

**Duration**: 45 minutes

**Dependencies**: Task 10

**Acceptance Criteria**:
- [ ] Email service integration
- [ ] Order confirmation emails
- [ ] Shipping notification emails
- [ ] Email templates

---

### Bonus Task 2: Implement Dark Mode

**Objective**: Add dark mode support to Admin Portal.

**Duration**: 30 minutes

**Dependencies**: Task 13

**Acceptance Criteria**:
- [ ] Dark mode toggle
- [ ] Theme provider
- [ ] Dark mode styles
- [ ] Persistent preference

---

### Bonus Task 3: Add Analytics

**Objective**: Implement basic analytics for admin dashboard.

**Duration**: 45 minutes

**Dependencies**: Task 13

**Acceptance Criteria**:
- [ ] Revenue chart
- [ ] Order trends
- [ ] Popular packages
- [ ] Date range filters

---

### Bonus Task 4: Implement Push Notifications

**Objective**: Add push notifications to mobile app.

**Duration**: 45 minutes

**Dependencies**: Task 16

**Acceptance Criteria**:
- [ ] Push notification setup
- [ ] Order status notifications
- [ ] Review notifications
- [ ] Notification permissions

---

## Priority Summary

**MVP Tasks (Must Have)**: Tasks 1-16

**Testing Tasks (Should Have)**: Tasks 17-18

**Bonus Tasks (Nice to Have)**: Bonus Tasks 1-4

## Estimated Total Time

- **MVP**: 6 hours
- **Testing**: 1 hour
- **Bonus**: 3 hours
- **Total**: 10 hours

---

## Notes

- Tasks can be run in parallel where dependencies allow
- Use feature branches for each task (required)
- Branch naming convention: `feature/task-<number>-<short-name>`
- Create branch from `main`, implement one task only, then open PR and merge
- Do not combine multiple tasks in one branch unless explicitly approved
- Commit frequently with descriptive messages
- Update documentation as you go
- Test at the end of each task
- Ask for help if stuck for more than 15 minutes
