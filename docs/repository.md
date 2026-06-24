# Repository Structure

## Overview

This document describes the complete repository structure for the Wellness Package Management System.

---

## Top-Level Directory Structure

```
tug-assessment/
├── apps/                    # Application code (3 apps)
├── libs/                    # Shared code (reusable libraries)
├── docs/                    # Documentation (this file)
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── tsconfig.base.json       # Base TypeScript configuration
├── tsconfig.json            # Root TypeScript configuration
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── README.md                # Project overview
└── .gitignore               # Git ignore rules
```

---

## `apps/` Directory

Contains all application code. Each app is a standalone project with its own dependencies and build configuration.

### `apps/backend/` - NestJS API Server

**Purpose**: REST API server for Admin and Mobile clients.

**Structure**:
```
apps/backend/
├── src/
│   ├── features/            # Feature modules
│   │   ├── wellness-packages/
│   │   │   ├── api/         # DTOs and OpenAPI specs
│   │   │   ├── controllers/ # HTTP controllers
│   │   │   ├── services/    # Business logic
│   │   │   ├── repositories/ # Data access layer
│   │   │   ├── schemas/     # Zod schemas
│   │   │   ├── types/       # TypeScript types
│   │   │   └── tests/       # Unit tests
│   │   ├── users/
│   │   │   └── ...
│   │   ├── orders/
│   │   │   └── ...
│   │   └── reviews/
│   │       └── ...
│   │
│   ├── shared/              # Shared backend concerns
│   │   ├── guards/          # Authentication/authorization guards
│   │   ├── filters/         # Exception filters
│   │   ├── interceptors/    # Request/response interceptors
│   │   ├── decorators/      # Custom decorators
│   │   ├── utils/           # Shared utilities
│   │   └── config/          # Configuration classes
│   │
│   └── main.ts              # Application entry point
│
├── prisma/                  # Database configuration
│   ├── schema.prisma        # Prisma schema
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Seed data
│
├── env/                     # Environment files (ignored by git)
│   ├── .env.local
│   ├── .env.development
│   ├── .env.staging
│   └── .env.production
│
├── test/                    # E2E tests
│
├── nest-cli.json            # NestJS CLI configuration
├── package.json             # Backend dependencies
└── tsconfig.json            # Backend TypeScript configuration
```

**Key Files**:
- `src/main.ts`: Application entry point, bootstraps NestJS
- `src/features/*/api/dto.ts`: Request/Response DTOs
- `src/features/*/api/openapi.ts`: OpenAPI specifications
- `src/features/*/services/*.service.ts`: Business logic
- `src/features/*/repositories/*.repository.ts`: Database access
- `src/features/*/schemas/*.schema.ts`: Zod validation schemas

---

### `apps/admin/` - Next.js Admin Portal

**Purpose**: Web-based administration interface for managing wellness packages, orders, and reviews.

**Structure**:
```
apps/admin/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── wellness-packages/
│   │   │   ├── page.tsx     # List
│   │   │   ├── create/      # Create
│   │   │   └── [id]/        # Edit (dynamic route)
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── reviews/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   └── layout.tsx           # Root layout
│
├── components/              # Shared components
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   └── admin/               # Admin-specific components
│       ├── AdminLayout.tsx
│       └── Sidebar.tsx
│
├── lib/                     # Shared utilities
│   ├── api.ts              # Centralized Axios client
│   ├── hooks.ts            # Shared hooks
│   ├── utils.ts            # Utility functions
│   └── types.ts            # Shared types
│
├── public/                  # Static assets
│   └── favicon.ico
│
├── next.config.js           # Next.js configuration
├── package.json             # Admin dependencies
└── tsconfig.json            # Admin TypeScript configuration
```

**Key Files**:
- `app/layout.tsx`: Root layout with providers
- `app/(auth)/login/page.tsx`: Login page
- `app/(dashboard)/wellness-packages/page.tsx`: Package management
- `lib/api.ts`: Centralized API client with interceptors
- `components/ui/*`: shadcn/ui components

---

### `apps/mobile/` - Expo Mobile App

**Purpose**: Mobile application for browsing wellness packages and managing orders.

**Structure**:
```
apps/mobile/
├── src/
│   ├── features/            # Feature screens
│   │   ├── wellness-packages/
│   │   │   ├── screens/     # Screen components
│   │   │   │   ├── PackageListScreen.tsx
│   │   │   │   ├── PackageDetailScreen.tsx
│   │   │   │   └── PackageSearchScreen.tsx
│   │   │   └── components/  # Feature components
│   │   │
│   │   ├── orders/
│   │   │   └── screens/
│   │   │       ├── OrderCreateScreen.tsx
│   │   │       └── OrderListScreen.tsx
│   │   │
│   │   └── reviews/
│   │       └── screens/
│   │           └── ReviewCreateScreen.tsx
│   │
│   ├── components/          # Shared components
│   │   ├── ui/              # Reusable UI components
│   │   └── layout/          # Layout components
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useTheme.ts
│   │
│   ├── services/            # API services
│   │   ├── api.ts           # API client
│   │   └── auth.ts          # Auth service
│   │
│   ├── navigation/          # Navigation configuration
│   │   ├── index.ts         # Root navigator
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   └── App.tsx              # Application entry point
│
├── assets/                  # Static assets
│   ├── images/
│   └── fonts/
│
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── package.json             # Mobile dependencies
└── tsconfig.json            # Mobile TypeScript configuration
```

**Key Files**:
- `src/App.tsx`: Application entry point
- `src/navigation/index.ts`: Navigation configuration
- `src/features/*/screens/*.tsx`: Screen components
- `src/services/api.ts`: API client
- `src/hooks/useAuth.ts`: Auth hook

---

## `libs/` Directory

Contains shared code that can be used across multiple apps.

### `libs/api-schemas/` - Shared API Schemas

**Purpose**: Centralized Zod schemas used by backend validation and frontend forms.

**Structure**:
```
libs/api-schemas/
├── wellness-packages/
│   ├── schema.ts            # Zod schema
│   ├── dto.ts               # Request/Response DTOs
│   └── openapi.ts         # OpenAPI specification
│
├── users/
│   ├── schema.ts
│   └── dto.ts
│
├── orders/
│   ├── schema.ts
│   └── dto.ts
│
├── reviews/
│   ├── schema.ts
│   └── dto.ts
│
└── index.ts                 # Barrel exports
```

**Key Files**:
- `schema.ts`: Zod schemas (single source of truth)
- `dto.ts`: TypeScript types inferred from schemas
- `openapi.ts`: OpenAPI specifications

**Usage**:
```typescript
// Backend
import { createPackageSchema } from '@libs/api-schemas/wellness-packages';

// Admin
import { createPackageSchema } from '@libs/api-schemas/wellness-packages';

// Mobile
import { createPackageSchema } from '@libs/api-schemas/wellness-packages';
```

---

### `libs/utils/` - Shared Utilities

**Purpose**: Shared utility functions and constants.

**Structure**:
```
libs/utils/
├── validation.ts            # Validation utilities
├── formatting.ts            # Formatting utilities
├── constants.ts             # Shared constants
├── errors.ts                # Error utilities
└── index.ts                 # Barrel exports
```

**Key Files**:
- `validation.ts`: Shared validation helpers
- `formatting.ts`: Date, currency, and data formatting
- `constants.ts`: Application constants (e.g., max upload size)

---

## How Apps Interact

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                     │
│  ┌─────────────────┐          ┌─────────────────┐                         │
│  │  Admin Portal   │          │  Mobile App     │                         │
│  │  (Next.js)      │          │  (Expo)         │                         │
│  └────────┬────────┘          └────────┬────────┘                         │
│           │                            │                                  │
│           └────────────────────────────┼──────────────────────────────────┘
│                                        │ HTTP/REST API
│                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NestJS Backend API                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────────┐ │  │
│  │  │ Controllers│  │ Services   │  │ Repositories│ │   Prisma ORM    │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └─────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PostgreSQL Database                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Admin Portal** → **Backend API** → **Database**
   - Admin creates/updates wellness packages
   - Admin views orders and reviews

2. **Mobile App** → **Backend API** → **Database**
   - User browses public wellness packages
   - User creates orders
   - User writes reviews

3. **Shared Schemas** → **All Apps**
   - Zod schemas ensure consistency
   - Type inference from schemas

---

## Shared Conventions

### Naming Standards

| Type | Convention | Example |
|------|------------|---------|
| Files | `kebab-case` | `wellness-package.service.ts` |
| Classes | `PascalCase` | `WellnessPackageService` |
| Functions/Variables | `camelCase` | `findPackageById` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_PACKAGE_NAME_LENGTH` |
| Components | `PascalCase` | `WellnessPackageList` |
| Routes | `kebab-case` | `/wellness-packages` |

### Code Organization

**Backend**:
- Feature-based structure
- Controllers thin (0 business logic)
- Business logic in services
- Database access in repositories

**Admin Portal**:
- App Router structure
- Server state with TanStack Query
- Form state with TanStack Form
- UI with shadcn/ui

**Mobile App**:
- Feature-based screens
- Server state with TanStack Query
- Form state with TanStack Form
- Navigation with React Navigation

### Error Handling

**Backend**:
```typescript
{
  success: false,
  message: "Error description",
  errors: [
    {
      field: "email",
      message: "Invalid email format",
      code: "INVALID_EMAIL"
    }
  ]
}
```

**Frontend**:
- Toast notifications for user-facing errors
- Error boundaries for React errors
- Retry logic for network errors

### API Communication

**Request Headers**:
```typescript
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Response Format**:
```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  message: "Error description",
  errors: [ ... ]
}
```

---

## Dependency Management

### pnpm Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'libs/*'
```

### Shared Dependencies

- **Zod**: Validation schemas in `libs/api-schemas/`
- **TypeScript**: Shared type definitions
- **Prisma**: Database schema in `apps/backend/prisma/`

### App-Specific Dependencies

- **Backend**: NestJS, Prisma, JWT libraries
- **Admin**: Next.js, TanStack Query, shadcn/ui
- **Mobile**: Expo, React Navigation, React Native Paper

---

## Configuration Files

### Root Configuration

| File | Purpose |
|------|---------|
| `package.json` | Root workspace configuration |
| `pnpm-workspace.yaml` | pnpm workspace definition |
| `tsconfig.base.json` | Base TypeScript configuration |
| `tsconfig.json` | Root TypeScript configuration |
| `.eslintrc.js` | ESLint rules |
| `.prettierrc` | Prettier formatting rules |
| `.gitignore` | Git ignore rules |

### App-Specific Configuration

| File | Purpose |
|------|---------|
| `nest-cli.json` | NestJS CLI configuration |
| `next.config.js` | Next.js configuration |
| `app.json` | Expo configuration |
| `babel.config.js` | Babel configuration |

---

## Environment Variables

### Backend

```env
# apps/backend/env/.env.development
DATABASE_URL=postgresql://user:pass@localhost:5432/wellness_dev
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
PORT=3000
```

### Admin Portal

```env
# apps/admin/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Wellness Admin"
```

### Mobile App

```env
# apps/mobile/.env.local
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME="Wellness Mobile"
```

---

## Development Workflow

### Starting Development Servers

```bash
# Backend
pnpm --filter backend dev

# Admin Portal
pnpm --filter admin dev

# Mobile App
pnpm --filter mobile dev
```

### Running Commands

```bash
# Run all linting
pnpm -r lint

# Run all typecheck
pnpm -r typecheck

# Run all tests
pnpm -r test

# Prisma commands
cd apps/backend && npx prisma migrate dev
```

### Building for Production

```bash
# Backend
pnpm --filter backend build

# Admin Portal
pnpm --filter admin build

# Mobile App
pnpm --filter mobile build
```

---

## Deployment

### Backend

- **Platform**: Docker container
- **Port**: 3000
- **Database**: PostgreSQL
- **Environment**: `.env.production`

### Admin Portal

- **Platform**: Vercel (recommended)
- **Build**: `pnpm --filter admin build`
- **Environment**: `.env.production`

### Mobile App

- **Platform**: Expo Application Services (EAS)
- **Build**: `eas build`
- **Distribution**: App Store and Play Store

---

## Summary

This repository structure follows Clean Architecture principles with:

1. **Feature-based organization**: Each feature has all related code together
2. **Shared libraries**: Zod schemas and utilities are shared across apps
3. **Clear separation**: Backend, Admin, and Mobile are independent
4. **Consistent patterns**: Same patterns across all apps
5. **Type safety**: Full TypeScript coverage with Zod validation

The structure is designed for:
- **Maintainability**: Easy to find and modify code
- **Scalability**: Easy to add new features
- **Collaboration**: Clear boundaries between apps
- **Type safety**: Strong typing throughout
