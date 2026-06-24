# Engineering Decisions

## Decision 1: Use pnpm Workspace Instead of Nx Monorepo

### The Decision

Use pnpm workspace as the monorepo solution instead of Nx.

### Alternatives Considered

1. **Nx Monorepo**: Full-featured task runner with built-in generators, caching, and project graph
2. **Lerna**: Traditional monorepo tool with versioning
3. **pnpm Workspace**: Lightweight package manager with workspace support
4. **Yarn Workspaces**: Alternative workspace solution

### Why This Approach

1. **Simplicity**: pnpm workspace is simpler to configure and understand
2. **Performance**: pnpm is faster than npm and Yarn due to its unique node_modules structure
3. **Space Efficiency**: Hard linking reduces disk space usage
4. **Tooling**: Works seamlessly with existing tooling (ESLint, TypeScript, Vitest)
5. **Learning Curve**: Easier for new developers to understand
6. **Flexibility**: No vendor lock-in to Nx's ecosystem

### Trade-offs

**Pros:**
- Lightweight and minimal configuration
- Fast installation and build times
- Easy to reason about
- No additional abstraction layer

**Cons:**
- No built-in task caching
- No automatic dependency graph visualization
- Manual script orchestration needed
- Less opinionated (more decisions to make)

### Future Improvements

- Consider Nx if project scales beyond 10+ projects
- Add Turborepo for caching if build times become an issue
- Use pnpm's `overrides` for dependency resolution

---

## Decision 2: Clean Architecture with Feature-Based Structure

### The Decision

Organize code by features rather than by technical layers (controllers, services, repositories).

### Alternatives Considered

1. **Layer-Based Structure**: Separate by technical layers (controllers/, services/, repositories/)
2. **Feature-Based Structure**: Group by domain features (wellness-packages/, users/, orders/)
3. **Hexagonal Architecture**: Separate by ports and adapters
4. **Onion Architecture**: Circular dependency with core domain at center

### Why This Approach

1. **Co-location**: Related code stays together, improving maintainability
2. **Feature Teams**: Teams can work on features independently
3. **Easier Navigation**: Find all code for a feature in one place
4. **Scalability**: Add new features without restructuring
5. **Testability**: Each feature is self-contained and testable

### Trade-offs

**Pros:**
- Better organization for domain-driven code
- Easier to find related code
- Supports feature teams
- Clear boundaries between features

**Cons:**
- Some duplication across features (e.g., shared guards)
- Harder to find all controllers/services globally
- Requires discipline to maintain boundaries

### Future Improvements

- Extract shared concerns to `libs/` (e.g., `libs/guards/`, `libs/filters/`)
- Create feature templates to ensure consistency
- Add lint rules to prevent cross-feature imports

---

## Decision 3: Zod as Single Source of Truth

### The Decision

Use Zod for all validation and type inference across backend and frontend.

### Alternatives Considered

1. **class-validator + class-transformer**: Decorator-based validation
2. **Joi**: Schema validation library
3. **Yup**: Schema validation library
4. **TypeORM + decorators**: ORM with validation
5. **Manual Validation**: Custom validation logic

### Why This Approach

1. **Single Source of Truth**: One schema for backend and frontend
2. **Type Safety**: Full TypeScript support with type inference
3. **Runtime Validation**: Validates at runtime, not just compile-time
4. **Lightweight**: No decorators or runtime dependencies
5. **Consistency**: Same validation rules in all layers
6. **OpenAPI Generation**: Can generate OpenAPI specs from Zod schemas

### Trade-offs

**Pros:**
- No schema duplication
- Type inference from schemas
- Works everywhere (Node, browser, React Native)
- Active community and ecosystem
- Good error messages

**Cons:**
- Learning curve for new developers
- No decorator syntax (some prefer this)
- Runtime validation overhead (negligible)

### Future Improvements

- Generate OpenAPI specs from Zod schemas
- Create shared schemas library
- Add schema versioning for API evolution

---

## Decision 4: Soft Delete for Audit Trail

### The Decision

Use soft delete (`deletedAt` field) for all models to maintain audit trail.

### Alternatives Considered

1. **Hard Delete**: Permanently remove records
2. **Soft Delete**: Add `deletedAt` timestamp
3. **Archive Flag**: Add `isArchived` boolean
4. **History Tables**: Separate audit tables

### Why This Approach

1. **Data Recovery**: Accidental deletions can be undone
2. **Audit Trail**: Complete history of all records
3. **Compliance**: Meet data retention requirements
4. **Referential Integrity**: Maintain relationships
5. **Analytics**: Track historical data

### Trade-offs

**Pros:**
- Data safety and recovery
- Complete audit trail
- Compliance-friendly
- No data loss

**Cons:**
- Database size grows over time
- Queries must filter out deleted records
- Requires migration strategy
- Potential performance impact

### Future Improvements

- Implement automatic archiving for old records
- Add data retention policies
- Archive to cold storage for compliance
- Add `prune` commands for cleanup

---

## Decision 5: Separate Admin and Mobile APIs

### The Decision

Create separate API endpoints for Admin and Mobile clients with different access levels.

### Alternatives Considered

1. **Single API**: One set of endpoints for all clients
2. **Versioned API**: Separate by version (v1/admin, v1/mobile)
3. **Microservices**: Separate services for admin and mobile
4. **GraphQL**: Single GraphQL API for all clients

### Why This Approach

1. **Security**: Different authentication and authorization rules
2. **Performance**: Mobile API optimized for mobile constraints
3. **Flexibility**: Different response formats for different clients
4. **Simplicity**: Clear separation of concerns
5. **Evolution**: Admin and mobile can evolve independently

### Trade-offs

**Pros:**
- Clear security boundaries
- Optimized for each client type
- Easier to maintain
- Different rate limiting per API

**Cons:**
- Code duplication (shared via libs)
- Two APIs to maintain
- More deployment complexity

### Future Improvements

- Extract shared schemas to `libs/api-schemas/`
- Use code generation for common endpoints
- Consider API Gateway for rate limiting and auth
- Add API versioning for breaking changes

---

## Decision 6: JWT-Based Authentication with Refresh Tokens

### The Decision

Use JWT for authentication with short-lived access tokens and long-lived refresh tokens.

### Alternatives Considered

1. **Session-Based**: Server-side sessions with cookies
2. **OAuth2**: Third-party authentication providers
3. **API Keys**: Simple key-based authentication
4. **Magic Links**: Passwordless authentication

### Why This Approach

1. **Stateless**: No session storage required
2. **Scalable**: Works across multiple backend instances
3. **Standard**: Well-supported ecosystem
4. **Secure**: With proper token management
5. **Flexible**: Can include custom claims (roles, permissions)

### Trade-offs

**Pros:**
- Stateless and scalable
- Standard and well-understood
- Works across platforms
- Easy to implement

**Cons:**
- Token revocation is complex
- Token storage must be secure
- Refresh token management required
- JWT size can grow

### Future Improvements

- Implement token blacklisting for revocation
- Add device-based token management
- Support OAuth2 for social login
- Add MFA support

---

## Decision 7: Use PostgreSQL with Prisma ORM

### The Decision

Use PostgreSQL with Prisma ORM as the database and ORM.

### Alternatives Considered

1. **MySQL**: Alternative relational database
2. **MongoDB**: NoSQL database
3. **TypeORM**: Alternative ORM
4. **Drizzle ORM**: Modern TypeScript ORM
5. **Raw SQL**: Direct SQL queries

### Why This Approach

1. **Type Safety**: Full TypeScript support
2. **Type Safety**: Type-safe queries and schemas
3. **Migrations**: Built-in migration system
4. **Studio**: Database GUI included
5. **Active Development**: Prisma is actively maintained
6. **PostgreSQL**: Production-ready relational database

### Trade-offs

**Pros:**
- Type-safe database access
- Automatic migrations
- Studio for database management
- Active community
- Production-ready

**Cons:**
- Learning curve for Prisma
- Less flexibility than raw SQL
- PostgreSQL overhead for simple apps

### Future Improvements

- Implement connection pooling
- Add read replicas for scaling
- Consider Redis for caching
- Add database monitoring

---

## Decision 8: TanStack Query for Server State

### The Decision

Use TanStack Query for server state management in both Admin and Mobile.

### Alternatives Considered

1. **Redux**: Global state management
2. **Context API**: React's built-in state management
3. **Zustand**: Lightweight state management
4. **React Query (v3)**: Previous version of TanStack Query
5. **SWR**: Another data fetching library

### Why This Approach

1. **Optimized for Server State**: Built for API data
2. **Automatic Caching**: Reduce unnecessary API calls
3. **Background Refetching**: Keep data fresh
4. **Type Safety**: Full TypeScript support
5. **DevTools**: Debugging tools included
6. **Consistent**: Same library across platforms

### Trade-offs

**Pros:**
- Optimized for API data
- Automatic caching and refetching
- Great TypeScript support
- Consistent API across platforms
- Active development

**Cons:**
- Learning curve for new developers
- Overkill for simple apps
- Additional dependency

### Future Improvements

- Implement optimistic updates
- Add offline support for mobile
- Use query invalidation strategically
- Add request batching

---

## Decision 9: Use shadcn/ui for Admin Portal

### The Decision

Use shadcn/ui as the UI component library for Admin Portal.

### Alternatives Considered

1. **Material UI**: Google's Material Design
2. **Ant Design**: Enterprise UI library
3. **Chakra UI**: Accessible component library
4. **Tailwind CSS**: Utility-first CSS framework
5. **Custom Components**: Build from scratch

### Why This Approach

1. **Customizable**: Components are copy-paste, fully customizable
2. **Accessible**: Built with accessibility in mind
3. **Lightweight**: No runtime overhead
4. **Consistent**: Follows design system
5. **TypeScript**: Full TypeScript support
6. **Radix UI**: Built on Radix UI primitives

### Trade-offs

**Pros:**
- Fully customizable
- Accessible by default
- Lightweight
- Consistent design system
- Active community

**Cons:**
- Copy-paste components (not tree-shakeable)
- Requires manual updates
- Learning curve for customization

### Future Improvements

- Create custom component library on top of shadcn/ui
- Add design tokens for theming
- Implement dark mode support
- Add custom components for domain-specific needs

---

## Decision 10: TypeScript for All Projects

### The Decision

Use TypeScript for Backend, Admin Portal, and Mobile App.

### Alternatives Considered

1. **JavaScript**: Dynamic typing
2. **Flow**: Static type checker for JavaScript
3. **Babel**: Transpile only, no types
4. **Dart**: Alternative language for Flutter

### Why This Approach

1. **Type Safety**: Catch errors at compile-time
2. **IDE Support**: Better autocomplete and refactoring
3. **Documentation**: Types as documentation
4. **Maintainability**: Easier to understand and modify
5. **Consistency**: Same language across stack
6. **Ecosystem**: Rich ecosystem of typed packages

### Trade-offs

**Pros:**
- Catch errors early
- Better IDE support
- Self-documenting code
- Easier refactoring
- Consistent across stack

**Cons:**
- Learning curve for new developers
- Compilation step required
- Type definitions not always available
- More boilerplate

### Future Improvements

- Enforce strict TypeScript settings
- Add ESLint rules for type safety
- Use `unknown` instead of `any`
- Add type coverage thresholds
