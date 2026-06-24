# Architecture

## High-Level System Overview

The Wellness Package Management System is a Full Stack application built with Clean Architecture principles. The system consists of three main applications:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                  │
│  ┌─────────────────┐          ┌─────────────────┐          ┌──────────────┐│
│  │  Admin Portal   │          │  Mobile App     │          │   External   ││
│  │  (Next.js)      │          │  (Expo)         │          │   Clients    ││
│  └────────┬────────┘          └────────┬────────┘          └──────┬───────┘│
│           │                            │                           │       │
│           └────────────────────────────┼───────────────────────────┘       │
│                                        │                                    │
└────────────────────────────────────────┼────────────────────────────────────┘
                                         │ HTTP/REST API
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY LAYER                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         NestJS Backend API                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────────┐ │  │
│  │  │ Controllers│  │  Guards    │  │ Filters    │  │ Interceptors    │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └─────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Feature Modules                               │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────────┐ │  │
│  │  │  Services  │  │ Validators │  │ Mappers    │  │ Use Cases       │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └─────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INFRASTRUCTURE LAYER                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────────────────┐   │
│  │  Repositories   │  │  Prisma ORM     │  │  External Services        │   │
│  │  (Data Access)  │  │  (Database)     │  │  (Email, Payment, etc.)   │   │
│  └─────────────────┘  └─────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         PostgreSQL Database                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Goals and Assumptions

### Goals

1. **Maintainability**: Code should be easy to understand, modify, and extend
2. **Clean Architecture**: Clear separation of concerns with dependency inversion
3. **Type Safety**: Full TypeScript coverage with Zod validation
4. **Production-Ready**: Scalable, testable, and documented
5. **Developer Experience**: Fast iteration with hot-reload and clear patterns

### Assumptions

1. **Authentication**: Implemented via JWT tokens (detailed in Authentication Approach section)
2. **Payment Integration**: Placeholder for external payment gateway (Stripe, PayPal)
3. **Email Notifications**: Placeholder for email service (SendGrid, Mailgun)
4. **File Storage**: Placeholder for cloud storage (AWS S3, Cloudinary)
5. **Rate Limiting**: Implemented at API gateway level
6. **Logging**: Structured JSON logging with Winston/Pino
7. **Monitoring**: Health check endpoints for load balancers

## Repository Structure

```
tug-assessment/
├── apps/
│   ├── backend/              # NestJS API server
│   │   ├── src/
│   │   │   ├── features/     # Feature modules
│   │   │   │   ├── wellness-packages/
│   │   │   │   ├── users/
│   │   │   │   ├── orders/
│   │   │   │   └── ...
│   │   │   ├── shared/
│   │   │   │   ├── guards/
│   │   │   │   ├── filters/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── decorators/
│   │   │   │   ├── utils/
│   │   │   │   └── config/
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── package.json
│   │
│   ├── admin/                # Next.js Admin Portal
│   │   ├── app/
│   │   │   ├── (auth)/       # Auth pages (login, register)
│   │   │   ├── (dashboard)/  # Dashboard pages
│   │   │   ├── (admin)/      # Admin-only pages
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── admin/        # Admin-specific components
│   │   ├── lib/
│   │   │   ├── api.ts        # Centralized Axios client
│   │   │   ├── hooks.ts      # Shared hooks
│   │   │   └── utils.ts
│   │   └── package.json
│   │
│   └── mobile/               # Expo Mobile App
│       ├── src/
│       │   ├── features/     # Feature screens
│       │   ├── components/   # Shared components
│       │   ├── hooks/        # Custom hooks
│       │   ├── services/     # API services
│       │   ├── navigation/   # React Navigation config
│       │   └── App.tsx
│       └── package.json
│
├── libs/
│   ├── api-schemas/          # Shared Zod schemas & OpenAPI
│   │   ├── wellness-packages/
│   │   ├── users/
│   │   └── index.ts
│   │
│   └── utils/                # Shared utilities
│       ├── validation.ts
│       ├── formatting.ts
│       └── constants.ts
│
├── docs/                     # This documentation
│   ├── architecture.md
│   ├── database.md
│   ├── api-contract.md
│   ├── decisions.md
│   ├── implementation-plan.md
│   └── repository.md
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

## Feature/Module Organization

Each feature follows a consistent structure:

```
feature/
├── api/                      # API layer
│   ├── dto.ts               # Request/Response DTOs
│   ├── openapi.ts           # OpenAPI specification
│   └── index.ts
│
├── components/               # UI components (Admin/Mobile)
│   ├── FeatureCard.tsx
│   └── FeatureList.tsx
│
├── pages/                    # Page routes (Admin)
│   ├── page.tsx
│   ├── [id]/page.tsx
│   └── create/page.tsx
│
├── screens/                  # Screen components (Mobile)
│   ├── FeatureScreen.tsx
│   └── FeatureDetailScreen.tsx
│
├── services/                 # Business logic
│   ├── feature.service.ts
│   └── feature.service.spec.ts
│
├── repositories/             # Data access layer
│   ├── feature.repository.ts
│   └── feature.repository.spec.ts
│
├── hooks/                    # Custom hooks (Admin/Mobile)
│   ├── useFeature.ts
│   └── useFeatureForm.ts
│
├── schemas/                  # Zod schemas (single source of truth)
│   ├── feature.schema.ts
│   └── index.ts
│
├── types/                    # TypeScript types (if not inferred from Zod)
│   ├── feature.types.ts
│   └── index.ts
│
└── tests/                    # Unit/integration tests
    ├── services/
    ├── repositories/
    └── e2e/
```

## Dependency Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY RULES (Dependency Inversion)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND DEPENDENCY GRAPH                           │  │
│  │                                                                         │  │
│  │  ┌─────────────────┐          ┌─────────────────┐                     │  │
│  │  │   Controllers   │ ◄────────│   Services      │                     │  │
│  │  └────────┬────────┘          └────────┬────────┘                     │  │
│  │           │                            │                              │  │
│  │           │          ┌─────────────────┘                              │  │
│  │           │          │                                                │  │
│  │           ▼          ▼                                               │  │
│  │  ┌─────────────────┐  ┌─────────────────┐                            │  │
│  │  │  Repositories   │ ◄───────────────│  │                            │  │
│  │  └─────────────────┘  └─────────────────┘                            │  │
│  │           │                            │                              │  │
│  │           ▼                            ▼                              │  │
│  │  ┌─────────────────┐          ┌─────────────────┐                     │  │
│  │  │  Prisma Schema  │          │  DTOs/Types     │                     │  │
│  │  └─────────────────┘          └─────────────────┘                     │  │
│  │                                                                         │  │
│  │  ARROWS POINT DOWN (Dependencies point inward)                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND DEPENDENCY GRAPH                          │  │
│  │                                                                         │  │
│  │  ┌─────────────────┐          ┌─────────────────┐                     │  │
│  │  │   Components    │ ◄────────│   Hooks         │                     │  │
│  │  └─────────────────┘          └─────────────────┘                     │  │
│  │           │                            │                              │  │
│  │           ▼                            ▼                              │  │
│  │  ┌─────────────────┐          ┌─────────────────┐                     │  │
│  │  │   Services      │ ◄────────│   API Schemas   │                     │  │
│  │  └─────────────────┘          └─────────────────┘                     │  │
│  │                                                                         │  │
│  │  ARROWS POINT DOWN (UI depends on business logic)                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Shared Concerns

### Error Handling

**Backend**: Global exception filter with structured response format

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

**Frontend**: Error boundaries (React) + centralized error handling (hooks/services)

### Logging

- **Backend**: Structured JSON logs with correlation IDs
- **Frontend**: Client-side error reporting with context

### Validation

- **Zod schemas** as single source of truth
- Backend: `nestjs-zod` decorators
- Frontend: `@tanstack/zod-form` integration

### Authentication

- JWT tokens with refresh tokens
- Protected routes via guards
- Role-based access control (RBAC)

### Configuration

- Environment variables via `@nestjs/config`
- Validation schema for all config values
- Multi-environment support (dev, staging, prod)

## Configuration Strategy

```
apps/backend/
├── src/
│   └── shared/
│       └── config/
│           ├── app.config.ts
│           ├── database.config.ts
│           ├── jwt.config.ts
│           └── index.ts
│
└── env/
    ├── .env.local
    ├── .env.development
    ├── .env.staging
    └── .env.production
```

**Rules:**

- All config defined in `shared/config/`
- Environment-specific `.env` files (ignored by git)
- Validation schema ensures all required values present
- Default values for optional config

## Error Handling Strategy

### Backend

1. **Validation Errors**: `400 Bad Request` with field-level details
2. **Authentication Errors**: `401 Unauthorized`
3. **Authorization Errors**: `403 Forbidden`
4. **Not Found Errors**: `404 Not Found`
5. **Conflict Errors**: `409 Conflict` (duplicate records)
6. **Internal Errors**: `500 Internal Server Error` (logged, masked for clients)

### Frontend

1. **Network Errors**: Retry logic + user-friendly message
2. **Authentication Errors**: Redirect to login
3. **Validation Errors**: Display inline with form fields
4. **Server Errors**: Toast notification + error boundary

## Validation Strategy

**Zod is the single source of truth:**

```typescript
// libs/api-schemas/wellness-packages/schema.ts
export const wellnessPackageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive().multipleOf(0.01),
  durationWeeks: z.number().int().min(1).max(52),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Backend validation
@UseGuards(JwtAuthGuard)
@Controller('wellness-packages')
export class WellnessPackagesController {
  @Post()
  @UseZodSchema(wellnessPackageSchema)
  create(@Body() data: z.infer<typeof wellnessPackageSchema>) {
    return this.service.create(data);
  }
}

// Frontend validation
const form = useForm({
  schema: wellnessPackageSchema,
  defaultValues: initialData
});
```

## Authentication Approach

### JWT-Based Authentication

**Why this approach:**

1. **Stateless**: No session storage required
2. **Scalable**: Works across multiple backend instances
3. **Standard**: Well-supported ecosystem
4. **Secure**: With proper token management

**Implementation:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. User submits credentials                                               │
│  2. Backend validates and issues JWT + Refresh Token                       │
│  3. Frontend stores tokens (httpOnly cookie or secure storage)            │
│  4. Requests include Authorization header                                  │
│  5. Backend validates token via guard                                      │
│  6. If token expired, refresh token issued                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Token Structure:**

- **Access Token**: Short-lived (15-30 min), includes user ID and roles
- **Refresh Token**: Long-lived (7-30 days), stored securely, used to obtain new access tokens

**Why not OAuth2/SSO for assessment:**

- JWT is sufficient for demonstrating authentication concepts
- OAuth2 adds complexity not needed for MVP
- Can be added later via `libs/api-schemas/oauth.schema.ts`

## API Communication Strategy

### Request Flow

```
Client → Axios → Interceptor (add token) → API Gateway → Controller → Service → Repository → Database
```

### Response Flow

```
Database → Repository → Service → Controller → Interceptor (transform) → Axios → Client
```

### Centralized API Client

**Admin Portal:**

```typescript
// apps/admin/lib/api.ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Mobile App:**

```typescript
// apps/mobile/services/api.ts
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000
});
```

### Response Format

**Success:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wellness Package",
    ...
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be at least 3 characters",
      "code": "MIN_LENGTH"
    }
  ]
}
```

## State Management Strategy

### Backend

- **Request-scoped**: Each request is stateless
- **Caching**: Redis for session tokens and frequently accessed data
- **Database**: PostgreSQL for persistent state

### Admin Portal

- **Server State**: TanStack Query (fetch, cache, sync)
- **Client State**: React Context or Zustand for UI state
- **Form State**: TanStack Form with Zod validation

### Mobile App

- **Server State**: TanStack Query
- **Client State**: React Context for auth, theme
- **Form State**: TanStack Form with Zod validation

### Why TanStack Query:

1. **Automatic caching**: Reduces unnecessary API calls
2. **Background refetching**: Keep data fresh
3. **Optimistic updates**: Better UX
4. **Type-safe**: Works with Zod schemas

## Deployment Overview

### Backend

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND DEPLOYMENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │  GitHub     │    │  CI/CD      │    │  Load       │    │  NestJS     │ │
│  │  Repository │ ─▶ │  Pipeline   │ ─▶ │  Balancer   │ ─▶ │  Instances  │ │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘ │
│                                                              │              │
│                                                              ▼              │
│                                                      ┌─────────────┐       │
│                                                      │  PostgreSQL   │       │
│                                                      └─────────────┘       │
│                                                                             │
│  Deployments:                                                               │
│  - Docker containers                                                        │
│  - Kubernetes or ECS for production                                         │
│  - Environment-specific config                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Admin Portal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ADMIN PORTAL DEPLOYMENT                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│  │  GitHub     │    │  CI/CD      │    │  CDN/Edge   │                    │
│  │  Repository │ ─▶ │  Pipeline   │ ─▶ │  Provider   │                    │
│  └─────────────┘    └─────────────┘    └─────────────┘                    │
│                                                                             │
│  Deployments:                                                               │
│  - Vercel (recommended)                                                     │
│  - Netlify                                                                  │
│  - Self-hosted (Nginx + Node)                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile App

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MOBILE APP DEPLOYMENT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│  │  GitHub     │    │  EAS Build  │    │  App Stores │                    │
│  │  Repository │ ─▶ │  Pipeline   │ ─▶ │  (Store/Play│                    │
│  └─────────────┘    └─────────────┘    └─────────────┘                    │
│                                                                             │
│  Deployments:                                                               │
│  - Expo Application Services (EAS)                                          │
│  - TestFlight (iOS)                                                         │
│  - Google Play Store (Android)                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Environment Strategy

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | `localhost:3000` | Local development |
| Staging | `staging.example.com` | Pre-production testing |
| Production | `example.com` | Live users |

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Push to branch                                                          │
│  2. Run linting (`pnpm -r lint`)                                           │
│  3. Run typecheck (`pnpm -r typecheck`)                                    │
│  4. Run tests (`pnpm -r test`)                                             │
│  5. Build application                                                       │
│  6. Deploy to environment                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Docker Configuration

```dockerfile
# apps/backend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production
FROM base AS production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Health Check Endpoints

```
GET /health
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-24T12:00:00Z"
}
```
