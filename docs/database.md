# Database

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ PAYMENTS : "makes"
    
    WELLNESS_PACKAGES ||--o{ ORDERS : "included in"
    WELLNESS_PACKAGES ||--o{ REVIEWS : "reviewed"
    
    ORDERS ||--|| PAYMENTS : "requires"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    
    SUBSCRIPTIONS ||--|| WELLNESS_PACKAGES : "extends"
    SUBSCRIPTIONS ||--|| USERS : "belongs to"
    
    USERS {
        string id PK
        string email
        string password_hash
        string first_name
        string last_name
        string phone
        string role
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    
    WELLNESS_PACKAGES {
        string id PK
        string name
        string description
        decimal price
        integer duration_weeks
        string status
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    
    ORDERS {
        string id PK
        string user_id FK
        string wellness_package_id FK
        string status
        decimal total_amount
        datetime order_date
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    
    ORDER_ITEMS {
        string id PK
        string order_id FK
        string wellness_package_id FK
        integer quantity
        decimal unit_price
    }
    
    REVIEWS {
        string id PK
        string user_id FK
        string wellness_package_id FK
        integer rating
        string comment
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    
    PAYMENTS {
        string id PK
        string order_id FK
        string user_id FK
        decimal amount
        string provider
        string status
        string transaction_id
        datetime paid_at
        datetime created_at
        datetime updated_at
    }
    
    SUBSCRIPTIONS {
        string id PK
        string user_id FK
        string wellness_package_id FK
        string status
        datetime start_date
        datetime end_date
        datetime created_at
        datetime updated_at
    }
```

## Prisma Schema Design

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Base model with common fields
abstract model BaseModel {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}

// ============================================
// USER MODEL
// ============================================
model User extends BaseModel {
  email        String   @unique
  passwordHash String
  firstName    String
  lastName     String
  phone        String?
  role         UserRole @default(USER)
  
  orders       Order[]
  reviews      Review[]
  payments     Payment[]
  subscriptions Subscription[]
}

// ============================================
// WELLNESS PACKAGE MODEL
// ============================================
model WellnessPackage extends BaseModel {
  name         String
  description  String
  price        Decimal
  durationWeeks Int
  status       PackageStatus @default(DRAFT)
  
  orders       Order[]
  reviews      Review[]
  subscriptions Subscription[]
}

// ============================================
// ORDER MODEL
// ============================================
model Order extends BaseModel {
  userId              String
  wellnessPackageId   String
  status              OrderStatus @default(PENDING)
  totalAmount         Decimal
  orderDate           DateTime  @default(now())
  
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  wellnessPackage     WellnessPackage @relation(fields: [wellnessPackageId], references: [id])
  items               OrderItem[]
  payment             Payment?
}

model OrderItem {
  id                String   @id @default(uuid())
  orderId           String
  wellnessPackageId String
  quantity          Int
  unitPrice         Decimal
  
  order             Order      @relation(fields: [orderId], references: [id], onDelete: Cascade)
  wellnessPackage   WellnessPackage @relation(fields: [wellnessPackageId], references: [id])
}

// ============================================
// REVIEW MODEL
// ============================================
model Review extends BaseModel {
  userId            String
  wellnessPackageId String
  rating            Int
  comment           String?
  
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  wellnessPackage   WellnessPackage @relation(fields: [wellnessPackageId], references: [id])
}

// ============================================
// PAYMENT MODEL
// ============================================
model Payment {
  id               String   @id @default(uuid())
  orderId          String
  userId           String
  amount           Decimal
  provider         PaymentProvider
  status           PaymentStatus
  transactionId    String?
  paidAt           DateTime?
  
  order            Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  user             User      @relation(fields: [userId], references: [id])
}

// ============================================
// SUBSCRIPTION MODEL
// ============================================
model Subscription {
  id                String   @id @default(uuid())
  userId            String
  wellnessPackageId String
  status            SubscriptionStatus
  startDate         DateTime
  endDate           DateTime?
  
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  wellnessPackage   WellnessPackage @relation(fields: [wellnessPackageId], references: [id])
}

// ============================================
// ENUMS
// ============================================
enum UserRole {
  ADMIN
  USER
}

enum PackageStatus {
  DRAFT
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentProvider {
  STRIPE
  PAYPAL
  CREDIT_CARD
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PENDING
}
```

## Entity Definitions

### User

Represents system users (admins and customers).

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| email | String | Unique email address |
| passwordHash | String | Encrypted password |
| firstName | String | User's first name |
| lastName | String | User's last name |
| phone | String? | Optional phone number |
| role | UserRole | User role (ADMIN/USER) |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| deletedAt | DateTime? | Soft delete timestamp |

### WellnessPackage

The core entity representing wellness packages users can purchase.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| name | String | Package name (max 100 chars) |
| description | String | Detailed description (max 1000 chars) |
| price | Decimal | Package price (2 decimal places) |
| durationWeeks | Int | Duration in weeks (1-52) |
| status | PackageStatus | Package availability status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| deletedAt | DateTime? | Soft delete timestamp |

### Order

Represents a customer's purchase order.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| userId | String | Foreign key to User |
| wellnessPackageId | String | Foreign key to WellnessPackage |
| status | OrderStatus | Order processing status |
| totalAmount | Decimal | Total order amount |
| orderDate | DateTime | When order was placed |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| deletedAt | DateTime? | Soft delete timestamp |

### OrderItem

Line items within an order.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| orderId | String | Foreign key to Order |
| wellnessPackageId | String | Foreign key to WellnessPackage |
| quantity | Int | Number of packages |
| unitPrice | Decimal | Price per unit |

### Review

User reviews for wellness packages.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| userId | String | Foreign key to User |
| wellnessPackageId | String | Foreign key to WellnessPackage |
| rating | Int | Rating (1-5) |
| comment | String? | Optional review text |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| deletedAt | DateTime? | Soft delete timestamp |

### Payment

Payment records for orders.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| orderId | String | Foreign key to Order |
| userId | String | Foreign key to User |
| amount | Decimal | Payment amount |
| provider | PaymentProvider | Payment provider (Stripe, PayPal, etc.) |
| status | PaymentStatus | Payment status |
| transactionId | String? | External transaction ID |
| paidAt | DateTime? | When payment was completed |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Subscription

Active subscriptions for wellness packages.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| userId | String | Foreign key to User |
| wellnessPackageId | String | Foreign key to WellnessPackage |
| status | SubscriptionStatus | Subscription status |
| startDate | DateTime | When subscription starts |
| endDate | DateTime? | When subscription ends |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Field Descriptions

### Common Patterns

1. **UUID Primary Keys**: Use `@default(uuid())` for distributed ID generation
2. **Timestamps**: `createdAt`, `updatedAt` on all models
3. **Soft Deletes**: `deletedAt` for audit trail (optional per model)
4. **Decimal for Money**: Use `Decimal` type for prices to avoid floating point issues

### Field Constraints

| Field | Constraint | Reason |
|-------|------------|--------|
| email | `@unique` | Prevent duplicate accounts |
| passwordHash | Required | Authentication |
| price | `Decimal` | Precise monetary values |
| rating | `Int` (1-5) | Valid range |
| durationWeeks | `Int` (1-52) | Business rule |

## Relationships

### One-to-Many

- **User → Orders**: One user can place many orders
- **User → Reviews**: One user can write many reviews
- **User → Payments**: One user can make many payments
- **WellnessPackage → Orders**: One package can be in many orders
- **WellnessPackage → Reviews**: One package can have many reviews
- **WellnessPackage → Subscriptions**: One package can have many subscriptions

### One-to-One

- **Order → Payment**: Each order has at most one payment
- **Order → OrderItems**: One-to-many (order contains multiple items)

### Cascade Deletes

- **Order → OrderItems**: Delete items when order is deleted
- **Order → Payment**: Delete payment when order is deleted
- **User → Orders**: Delete user orders when user is deleted

## Enum Definitions

### UserRole

```typescript
enum UserRole {
  ADMIN  // System administrators
  USER   // Regular customers
}
```

### PackageStatus

```typescript
enum PackageStatus {
  DRAFT      // Not yet published
  ACTIVE     // Available for purchase
  INACTIVE   // Temporarily unavailable
  ARCHIVED   // No longer available
}
```

### OrderStatus

```typescript
enum OrderStatus {
  PENDING    // Order created, awaiting confirmation
  CONFIRMED  // Order confirmed, processing
  SHIPPED    // Order shipped
  DELIVERED  // Order delivered
  CANCELLED  // Order cancelled
  REFUNDED   // Order refunded
}
```

### PaymentProvider

```typescript
enum PaymentProvider {
  STRIPE       // Stripe payment
  PAYPAL       // PayPal payment
  CREDIT_CARD  // Direct credit card
  BANK_TRANSFER // Bank transfer
}
```

### PaymentStatus

```typescript
enum PaymentStatus {
  PENDING      // Payment initiated
  PROCESSING   // Payment being processed
  COMPLETED    // Payment successful
  FAILED       // Payment failed
  REFUNDED     // Payment refunded
}
```

### SubscriptionStatus

```typescript
enum SubscriptionStatus {
  ACTIVE     // Subscription is active
  EXPIRED    // Subscription has expired
  CANCELLED  // Subscription cancelled by user
  PENDING    // Subscription pending activation
}
```

## Index Strategy

### Required Indexes

```prisma
// User indexes
index [email] (email)
index [role] (role)

// WellnessPackage indexes
index [name] (name)
index [status] (status)
index [price] (price)

// Order indexes
index [userId] (userId)
index [wellnessPackageId] (wellnessPackageId)
index [status] (status)
index [orderDate] (orderDate)

// Review indexes
index [userId] (userId)
index [wellnessPackageId] (wellnessPackageId)

// Payment indexes
index [orderId] (orderId)
index [userId] (userId)
index [status] (status)

// Subscription indexes
index [userId] (userId)
index [wellnessPackageId] (wellnessPackageId)
index [status] (status)
```

### Composite Indexes

```prisma
// For common query patterns
index [userId, orderDate] (userId, orderDate) // User's recent orders
index [wellnessPackageId, rating] (wellnessPackageId, rating) // Package reviews by rating
index [status, createdAt] (status, createdAt) // Recent orders by status
```

### Full-Text Search

```prisma
// Add to WellnessPackage for search
@@fulltext([name, description])
```

## Migration Strategy

### Development Workflow

```bash
# 1. Make changes to schema.prisma
# 2. Generate migration
npx prisma migrate dev --name add_new_feature

# 3. Review generated migration
# 4. Apply to development database
npx prisma migrate deploy

# 5. Generate Prisma client
npx prisma generate
```

### Production Workflow

```bash
# 1. Run migrations on production database
npx prisma migrate deploy

# 2. Verify migration status
npx prisma migrate status
```

### Migration Naming Convention

```
<timestamp>_<description>.sql

Examples:
20260624120000_create_users_table.sql
20260624120100_add_email_index.sql
20260624120200_add_wellness_packages.sql
```

### Rollback Strategy

```bash
# Rollback last migration
npx prisma migrate resolve rolledback <migration_name>

# Reset database (development only)
npx prisma migrate reset
```

## Seed Strategy

### Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: '$2b$10$...', // Hashed password
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });

  // Create sample wellness packages
  const packages = [
    {
      name: 'Basic Wellness Package',
      description: 'Essential wellness services for beginners',
      price: 99.99,
      durationWeeks: 4,
      status: 'ACTIVE'
    },
    {
      name: 'Premium Wellness Package',
      description: 'Comprehensive wellness program with expert support',
      price: 299.99,
      durationWeeks: 12,
      status: 'ACTIVE'
    },
    {
      name: 'Elite Wellness Package',
      description: 'Full-service wellness experience with personalized coaching',
      price: 999.99,
      durationWeeks: 26,
      status: 'ACTIVE'
    }
  ];

  for (const pkg of packages) {
    await prisma.wellnessPackage.create({ data: pkg });
  }

  console.log({ admin, packages });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

### Running Seeds

```bash
npx prisma db seed
```

### Production Seeding

- **Never seed production data** directly
- Use separate migration files for production data
- Example: `20260624120300_insert_default_packages.sql`

## Scalability Considerations

### Database Scaling

1. **Read Replicas**: Add read replicas for high-traffic read operations
2. **Connection Pooling**: Use PgBouncer for connection management
3. **Caching**: Redis for frequently accessed data (packages, categories)

### Index Optimization

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM "WellnessPackage" WHERE status = 'ACTIVE';

-- Add missing indexes based on slow queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wellness_packages_status ON "WellnessPackage"(status);
```

### Partitioning Strategy

```sql
-- Partition orders by year for large datasets
CREATE TABLE orders_2026 (
  LIKE orders INCLUDING ALL
) INHERITS (orders);

-- Partition key: orderDate
```

### Connection Pool Settings

```env
# env.production
DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=20"
```

### Monitoring

```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Backup Strategy

```bash
# Daily backups
pg_dump -h localhost -U user -d wellness_db | gzip > backup_$(date +%Y%m%d).sql.gz

# Point-in-time recovery
pg_restore -d wellness_db backup_latest.sql.gz
```

### Security

```sql
-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY user_select ON users FOR SELECT USING (id = current_user_id());
```

## Wellness Package Entity Details

The `WellnessPackage` is the core entity in the system. It represents the products users can purchase.

### Key Attributes

1. **name**: Package identifier (required, unique within status)
2. **description**: Detailed product description
3. **price**: Monetary value (Decimal type for precision)
4. **durationWeeks**: Package validity period
5. **status**: Controls availability and visibility

### Business Rules

- Packages can be DRAFT, ACTIVE, INACTIVE, or ARCHIVED
- Only ACTIVE packages can be purchased
- Price must be positive and have 2 decimal places
- Duration must be between 1-52 weeks
- Packages can be reviewed by users
- Packages can be ordered multiple times

### Query Patterns

```typescript
// Find active packages
SELECT * FROM "WellnessPackage" WHERE status = 'ACTIVE';

// Get package with reviews
SELECT p.*, AVG(r.rating) as avg_rating
FROM "WellnessPackage" p
LEFT JOIN "Review" r ON p.id = r."wellnessPackageId"
WHERE p.status = 'ACTIVE'
GROUP BY p.id;

// Search packages
SELECT * FROM "WellnessPackage"
WHERE status = 'ACTIVE'
AND (to_tsvector(name) @@ to_tsquery('search term'));
```
