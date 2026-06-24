# AI Usage Report

This section summarizes how AI was used during implementation, what worked well, what failed, and where AI was intentionally not used.

## AI Tools Used And Purpose

- **OpenCode (GPT-5.3-codex)**
  - Scaffolding monorepo structure (`apps/`, `libs/`, workspace configs)
  - Generating backend feature modules (auth, wellness packages, orders, reviews)
  - Creating admin portal foundations (App Router structure, providers, service/hook scaffolding)
  - Drafting and updating project docs (`implementation-plan`, UI fix docs)
- **Terminal automation through AI orchestration**
  - Dependency installation and lockfile updates (`pnpm install`)
  - Validation runs (`lint`, `typecheck`, `test`, `build`)
  - Prisma workflows (`migrate`, `generate`, `seed`)
  - Runtime smoke tests for API endpoints and route checks
- **AI-assisted debugging**
  - Diagnosing backend startup/runtime path mismatches and module resolution issues
  - Fixing guard/module DI wiring and cross-module shared provider setup
  - Addressing frontend network/CORS behavior and environment-loading issues

## Prompt Sequences That Worked Well

### 1) Task-driven execution with acceptance criteria mapping

**Prompt sequence idea:**
- "Implement only one task at a time, dependency order, map every change to acceptance checklist, run lint/typecheck/tests after each task."

**Why it worked:**
- Forced disciplined delivery and verification after each unit of work.
- Reduced drift and made progress auditable.
- Kept implementation aligned with `AGENTS.md` architecture boundaries.

### 2) Constraint-first frontend refinement

**Prompt sequence idea:**
- "Use AGENTS.md as source of truth, implement shadcn + Tailwind setup, replace custom primitives with shadcn components, keep TanStack Query/Form and Axios patterns."

**Why it worked:**
- Converted broad design feedback into enforceable technical constraints.
- Prevented ad-hoc UI divergence and aligned with project standards.
- Produced reusable UI building blocks (`button`, `input`, `card`, `sidebar`, `table`, `sonner`).

### 3) Behavior-specific UI correction loop

**Prompt sequence idea:**
- "When sidebar is collapsed, hovering logo/title should turn into collapse/expand button."

**Why it worked:**
- High specificity removed ambiguity around state/interaction.
- Enabled targeted fix with minimal code churn.

## Example Where AI Got It Wrong

- **What went wrong:**
  - Sidebar interaction behavior was initially implemented opposite to intended UX (button shown on expanded hover instead of collapsed logo hover transition).
- **How it was caught:**
  - Manual UI review and direct user feedback highlighted mismatch with expected behavior.
- **How course was corrected:**
  - Reworked header interaction logic so collapsed state shows logo by default and swaps to trigger button on hover.
  - Re-ran `lint`, `typecheck`, and `build` to confirm no regressions.

Additional notable correction:
- A global roles guard application caused unintended forbidden responses; guard usage was moved to route-level composition with explicit `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(...)`.

## Where We Chose NOT To Use AI

- **Final UX judgment and acceptance sign-off**
  - Human review was used to validate whether behavior matched product intent (especially sidebar interactions and visual states).
- **GitHub account/permission decisions**
  - Credential ownership, auth method selection (SSH vs HTTPS), and repository permission resolution were handled manually for security reasons.
- **Branching policy decision enforcement**
  - Team process decisions (one branch per task, naming conventions) were explicitly human-directed and then documented.

## Summary

AI was most effective for structured scaffolding, repetitive boilerplate, and fast iteration under explicit constraints. Human oversight remained essential for UX intent, security-sensitive operations, and process governance.

