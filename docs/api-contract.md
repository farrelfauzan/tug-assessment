# API Contract

## Overview

This document defines the complete REST API for the Wellness Package Management System.

**Base URL**: `https://api.wellness.com/v1`

**Response Format**:

```json
{
  "success": true,
  "data": { ... }
}
```

**Error Format**:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "INVALID_EMAIL"
    }
  ]
}
```

---

## Admin API

All Admin API endpoints require authentication via JWT token.

### Authentication Endpoints

#### 1. Login

Authenticate a user and return JWT tokens.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Schema**:
```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

- **Response Schema**:
```typescript
const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['ADMIN', 'USER'])
  })
});
```

- **Validation Rules**:
  - Email must be valid format
  - Password must be at least 8 characters
  - User must exist and password must match

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [
    {
      "field": "email",
      "message": "User not found",
      "code": "USER_NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`

---

#### 2. Refresh Token

Refresh expired access token using refresh token.

- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Authentication**: Refresh token in cookie
- **Request Schema**:
```typescript
const refreshSchema = z.object({
  refreshToken: z.string()
});
```

- **Response Schema**:
```typescript
const refreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Invalid refresh token",
  "errors": [
    {
      "field": "refreshToken",
      "message": "Token has expired",
      "code": "TOKEN_EXPIRED"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `401`

---

#### 3. Logout

Revoke current session tokens.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Authentication**: Access token
- **Request Schema**: Empty body
- **Response Schema**:
```typescript
const logoutResponseSchema = z.object({
  message: z.string()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Invalid token",
  "errors": [
    {
      "field": "authorization",
      "message": "Token not found",
      "code": "TOKEN_NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `401`

---

### Wellness Packages Endpoints

#### 4. List Wellness Packages

Retrieve paginated list of wellness packages.

- **URL**: `/wellness-packages`
- **Method**: `GET`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const listPackagesSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  search: z.string().optional()
});
```

- **Response Schema**:
```typescript
const packageListResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    durationWeeks: z.number(),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']),
    createdAt: z.date(),
    updatedAt: z.date()
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});
```

- **Validation Rules**:
  - Page and limit must be positive integers
  - Limit cannot exceed 100
  - Search term is optional

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Basic Wellness Package",
        "description": "Essential wellness services",
        "price": 99.99,
        "durationWeeks": 4,
        "status": "ACTIVE",
        "createdAt": "2026-06-24T10:00:00Z",
        "updatedAt": "2026-06-24T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "limit",
      "message": "Limit cannot exceed 100",
      "code": "MAX_VALUE"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`

---

#### 5. Get Wellness Package by ID

Retrieve a single wellness package by ID.

- **URL**: `/wellness-packages/{id}`
- **Method**: `GET`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const packageIdSchema = z.object({
  id: z.string().uuid()
});
```

- **Response Schema**:
```typescript
const packageResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  durationWeeks: z.number(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']),
  ordersCount: z.number(),
  reviewsCount: z.number(),
  avgRating: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Basic Wellness Package",
    "description": "Essential wellness services",
    "price": 99.99,
    "durationWeeks": 4,
    "status": "ACTIVE",
    "ordersCount": 150,
    "reviewsCount": 25,
    "avgRating": 4.5,
    "createdAt": "2026-06-24T10:00:00Z",
    "updatedAt": "2026-06-24T10:00:00Z"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Package not found",
  "errors": [
    {
      "field": "id",
      "message": "Package with this ID does not exist",
      "code": "NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`

---

#### 6. Create Wellness Package

Create a new wellness package.

- **URL**: `/wellness-packages`
- **Method**: `POST`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const createPackageSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive().multipleOf(0.01),
  durationWeeks: z.number().int().min(1).max(52),
  status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT')
});
```

- **Response Schema**:
```typescript
const createPackageResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  durationWeeks: z.number(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']),
  createdAt: z.date(),
  updatedAt: z.date()
});
```

- **Validation Rules**:
  - Name must be 3-100 characters
  - Description must be 10-1000 characters
  - Price must be positive with 2 decimal places
  - Duration must be 1-52 weeks
  - Status must be DRAFT or ACTIVE

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Premium Wellness Package",
    "description": "Comprehensive wellness program",
    "price": 299.99,
    "durationWeeks": 12,
    "status": "ACTIVE",
    "createdAt": "2026-06-24T12:00:00Z",
    "updatedAt": "2026-06-24T12:00:00Z"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be at least 3 characters",
      "code": "MIN_LENGTH"
    },
    {
      "field": "price",
      "message": "Price must be positive",
      "code": "POSITIVE"
    }
  ]
}
```

- **HTTP Status Codes**: `201`, `400`, `401`

---

#### 7. Update Wellness Package

Update an existing wellness package.

- **URL**: `/wellness-packages/{id}`
- **Method**: `PATCH`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const updatePackageSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  price: z.number().positive().multipleOf(0.01).optional(),
  durationWeeks: z.number().int().min(1).max(52).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']).optional()
});
```

- **Response Schema**: Same as create package response

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Basic Wellness Package (Updated)",
    "description": "Essential wellness services",
    "price": 119.99,
    "durationWeeks": 4,
    "status": "ACTIVE",
    "createdAt": "2026-06-24T10:00:00Z",
    "updatedAt": "2026-06-24T12:30:00Z"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Package not found",
  "errors": [
    {
      "field": "id",
      "message": "Package with this ID does not exist",
      "code": "NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`

---

#### 8. Delete Wellness Package

Delete a wellness package (soft delete).

- **URL**: `/wellness-packages/{id}`
- **Method**: `DELETE`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const packageIdSchema = z.object({
  id: z.string().uuid()
});
```

- **Response Schema**:
```typescript
const deletePackageResponseSchema = z.object({
  message: z.string()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "message": "Package deleted successfully"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Cannot delete active package with orders",
  "errors": [
    {
      "field": "id",
      "message": "Package has existing orders",
      "code": "HAS_CHILD_RECORDS"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`

---

### Orders Endpoints

#### 9. List Orders

Retrieve paginated list of orders.

- **URL**: `/orders`
- **Method**: `GET`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const listOrdersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});
```

- **Response Schema**:
```typescript
const orderListResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string()
    }),
    wellnessPackage: z.object({
      id: z.string().uuid(),
      name: z.string()
    }),
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    totalAmount: z.number(),
    orderDate: z.date(),
    createdAt: z.date()
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "email": "user@example.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "wellnessPackage": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Basic Wellness Package"
        },
        "status": "CONFIRMED",
        "totalAmount": 99.99,
        "orderDate": "2026-06-24T10:00:00Z",
        "createdAt": "2026-06-24T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Invalid date range",
  "errors": [
    {
      "field": "endDate",
      "message": "End date must be after start date",
      "code": "INVALID_DATE_RANGE"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`

---

#### 10. Get Order by ID

Retrieve a single order by ID.

- **URL**: `/orders/{id}`
- **Method**: `GET`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const orderIdSchema = z.object({
  id: z.string().uuid()
});
```

- **Response Schema**:
```typescript
const orderResponseSchema = z.object({
  id: z.string().uuid(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string()
  }),
  wellnessPackage: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string()
  }),
  items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number(),
    unitPrice: z.number()
  })),
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  totalAmount: z.number(),
  orderDate: z.date(),
  payment: z.object({
    id: z.string().uuid(),
    provider: z.enum(['STRIPE', 'PAYPAL', 'CREDIT_CARD', 'BANK_TRANSFER']),
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']),
    amount: z.number(),
    transactionId: z.string().nullable()
  }).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "user": { ... },
    "wellnessPackage": { ... },
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "quantity": 1,
        "unitPrice": 99.99
      }
    ],
    "status": "CONFIRMED",
    "totalAmount": 99.99,
    "orderDate": "2026-06-24T10:00:00Z",
    "payment": {
      "id": "550e8400-e29b-41d4-a716-446655440030",
      "provider": "STRIPE",
      "status": "COMPLETED",
      "amount": 99.99,
      "transactionId": "ch_123456789"
    },
    "createdAt": "2026-06-24T10:00:00Z",
    "updatedAt": "2026-06-24T11:00:00Z"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Order not found",
  "errors": [
    {
      "field": "id",
      "message": "Order with this ID does not exist",
      "code": "NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`

---

#### 11. Update Order Status

Update order processing status.

- **URL**: `/orders/{id}/status`
- **Method**: `PATCH`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'])
});
```

- **Response Schema**: Same as get order by ID response

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "status": "SHIPPED",
    ...
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Invalid status transition",
  "errors": [
    {
      "field": "status",
      "message": "Cannot transition from PENDING to DELIVERED",
      "code": "INVALID_TRANSITION"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`

---

### Reviews Endpoints

#### 12. List Reviews

Retrieve paginated list of reviews.

- **URL**: `/reviews`
- **Method**: `GET`
- **Authentication**: Admin token
- **Request Schema**:
```typescript
const listReviewsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  rating: z.number().int().min(1).max(5).optional(),
  packageId: z.string().uuid().optional()
});
```

- **Response Schema**:
```typescript
const reviewListResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string()
    }),
    wellnessPackage: z.object({
      id: z.string().uuid(),
      name: z.string()
    }),
    rating: z.number(),
    comment: z.string().nullable(),
    createdAt: z.date()
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "email": "user@example.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "wellnessPackage": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Basic Wellness Package"
        },
        "rating": 5,
        "comment": "Excellent package!",
        "createdAt": "2026-06-24T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5",
  "errors": [
    {
      "field": "rating",
      "message": "Invalid rating value",
      "code": "INVALID_RANGE"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`

---

## Mobile API

Mobile API endpoints are read-only and do not require authentication (except where noted).

### Wellness Packages Endpoints

#### 1. List Active Wellness Packages

Retrieve list of active wellness packages for public viewing.

- **URL**: `/mobile/wellness-packages`
- **Method**: `GET`
- **Authentication**: None
- **Request Schema**:
```typescript
const listActivePackagesSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});
```

- **Response Schema**:
```typescript
const mobilePackageListResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    durationWeeks: z.number(),
    avgRating: z.number().nullable(),
    reviewsCount: z.number(),
    imageUrl: z.string().nullable()
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Basic Wellness Package",
        "description": "Essential wellness services for beginners",
        "price": 99.99,
        "durationWeeks": 4,
        "avgRating": 4.5,
        "reviewsCount": 25,
        "imageUrl": "https://cdn.example.com/packages/basic.jpg"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

- **HTTP Status Codes**: `200`, `400`

---

#### 2. Get Wellness Package by ID

Retrieve a single wellness package by ID.

- **URL**: `/mobile/wellness-packages/{id}`
- **Method**: `GET`
- **Authentication**: None
- **Request Schema**:
```typescript
const packageIdSchema = z.object({
  id: z.string().uuid()
});
```

- **Response Schema**:
```typescript
const mobilePackageResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  durationWeeks: z.number(),
  features: z.array(z.string()),
  avgRating: z.number().nullable(),
  reviewsCount: z.number(),
  imageUrl: z.string().nullable()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Basic Wellness Package",
    "description": "Essential wellness services for beginners",
    "price": 99.99,
    "durationWeeks": 4,
    "features": ["Consultation", "Workout Plan", "Nutrition Guide"],
    "avgRating": 4.5,
    "reviewsCount": 25,
    "imageUrl": "https://cdn.example.com/packages/basic.jpg"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Package not found",
  "errors": [
    {
      "field": "id",
      "message": "Package with this ID does not exist",
      "code": "NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `404`

---

#### 3. Search Wellness Packages

Search wellness packages by name or description.

- **URL**: `/mobile/wellness-packages/search`
- **Method**: `GET`
- **Authentication**: None
- **Request Schema**:
```typescript
const searchPackagesSchema = z.object({
  query: z.string().min(2).max(100),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});
```

- **Response Schema**: Same as list active packages response

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Basic Wellness Package",
        ...
      }
    ],
    "pagination": { ... }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Search query too short",
  "errors": [
    {
      "field": "query",
      "message": "Search query must be at least 2 characters",
      "code": "MIN_LENGTH"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`

---

#### 4. Get Package Reviews

Retrieve reviews for a specific wellness package.

- **URL**: `/mobile/wellness-packages/{id}/reviews`
- **Method**: `GET`
- **Authentication**: None
- **Request Schema**:
```typescript
const packageReviewsSchema = z.object({
  id: z.string().uuid(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});
```

- **Response Schema**:
```typescript
const packageReviewsResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    user: z.object({
      firstName: z.string(),
      lastName: z.string()
    }),
    rating: z.number(),
    comment: z.string().nullable(),
    createdAt: z.date()
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  }),
  avgRating: z.number().nullable(),
  ratingDistribution: z.object({
    5: z.number(),
    4: z.number(),
    3: z.number(),
    2: z.number(),
    1: z.number()
  })
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "rating": 5,
        "comment": "Excellent package!",
        "createdAt": "2026-06-24T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "totalPages": 2
    },
    "avgRating": 4.5,
    "ratingDistribution": {
      "5": 15,
      "4": 7,
      "3": 2,
      "2": 1,
      "1": 0
    }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Package not found",
  "errors": [
    {
      "field": "id",
      "message": "Package with this ID does not exist",
      "code": "NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `404`

---

#### 5. Get User Reviews

Retrieve reviews written by the current user.

- **URL**: `/mobile/reviews`
- **Method**: `GET`
- **Authentication**: User token
- **Request Schema**:
```typescript
const userReviewsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});
```

- **Response Schema**:
```typescript
const userReviewsResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    wellnessPackage: z.object({
      id: z.string().uuid(),
      name: z.string()
    }),
    rating: z.number(),
    comment: z.string().nullable(),
    createdAt: z.date()
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440040",
        "wellnessPackage": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Basic Wellness Package"
        },
        "rating": 5,
        "comment": "Excellent package!",
        "createdAt": "2026-06-24T12:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": [
    {
      "field": "authorization",
      "message": "Token not provided",
      "code": "TOKEN_NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`

---

### Orders Endpoints

#### 6. Create Order

Create a new order for a wellness package.

- **URL**: `/mobile/orders`
- **Method**: `POST`
- **Authentication**: User token
- **Request Schema**:
```typescript
const createOrderSchema = z.object({
  wellnessPackageId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1)
});
```

- **Response Schema**:
```typescript
const createOrderResponseSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  totalAmount: z.number(),
  orderDate: z.date(),
  items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number(),
    unitPrice: z.number()
  }))
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "status": "PENDING",
    "totalAmount": 99.99,
    "orderDate": "2026-06-24T12:00:00Z",
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "quantity": 1,
        "unitPrice": 99.99
      }
    ]
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Package not available",
  "errors": [
    {
      "field": "wellnessPackageId",
      "message": "Package is not currently available",
      "code": "NOT_AVAILABLE"
    }
  ]
}
```

- **HTTP Status Codes**: `201`, `400`, `401`, `404`

---

#### 7. List User Orders

Retrieve orders placed by the current user.

- **URL**: `/mobile/orders`
- **Method**: `GET`
- **Authentication**: User token
- **Request Schema**:
```typescript
const listUserOrdersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});
```

- **Response Schema**:
```typescript
const userOrdersResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    wellnessPackage: z.object({
      id: z.string().uuid(),
      name: z.string()
    }),
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    totalAmount: z.number(),
    orderDate: z.date()
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "wellnessPackage": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "Basic Wellness Package"
        },
        "status": "CONFIRMED",
        "totalAmount": 99.99,
        "orderDate": "2026-06-24T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": [
    {
      "field": "authorization",
      "message": "Token not provided",
      "code": "TOKEN_NOT_FOUND"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`

---

#### 8. Get Order by ID

Retrieve a single order by ID (user's own order only).

- **URL**: `/mobile/orders/{id}`
- **Method**: `GET`
- **Authentication**: User token
- **Request Schema**:
```typescript
const orderIdSchema = z.object({
  id: z.string().uuid()
});
```

- **Response Schema**: Same as get order by ID in Admin API

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    ...
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Order not found or access denied",
  "errors": [
    {
      "field": "id",
      "message": "You do not have access to this order",
      "code": "ACCESS_DENIED"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`

---

### Reviews Endpoints

#### 9. Create Review

Create a review for a wellness package.

- **URL**: `/mobile/reviews`
- **Method**: `POST`
- **Authentication**: User token
- **Request Schema**:
```typescript
const createReviewSchema = z.object({
  wellnessPackageId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000).optional()
});
```

- **Response Schema**:
```typescript
const createReviewResponseSchema = z.object({
  id: z.string().uuid(),
  wellnessPackageId: z.string().uuid(),
  rating: z.number(),
  comment: z.string().nullable(),
  createdAt: z.date()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440040",
    "wellnessPackageId": "550e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "comment": "Excellent package!",
    "createdAt": "2026-06-24T12:00:00Z"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Already reviewed this package",
  "errors": [
    {
      "field": "wellnessPackageId",
      "message": "You have already reviewed this package",
      "code": "ALREADY_REVIEWED"
    }
  ]
}
```

- **HTTP Status Codes**: `201`, `400`, `401`, `404`

---

#### 10. Update Review

Update an existing review.

- **URL**: `/mobile/reviews/{id}`
- **Method**: `PATCH`
- **Authentication**: User token (owner only)
- **Request Schema**:
```typescript
const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional()
});
```

- **Response Schema**: Same as create review response

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440040",
    "rating": 4,
    "comment": "Good package, could be better",
    "createdAt": "2026-06-24T12:00:00Z"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Review not found or access denied",
  "errors": [
    {
      "field": "id",
      "message": "You do not have access to this review",
      "code": "ACCESS_DENIED"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`

---

#### 11. Delete Review

Delete a review.

- **URL**: `/mobile/reviews/{id}`
- **Method**: `DELETE`
- **Authentication**: User token (owner only)
- **Request Schema**:
```typescript
const reviewIdSchema = z.object({
  id: z.string().uuid()
});
```

- **Response Schema**:
```typescript
const deleteReviewResponseSchema = z.object({
  message: z.string()
});
```

- **Success Example**:
```json
{
  "success": true,
  "data": {
    "message": "Review deleted successfully"
  }
}
```

- **Error Example**:
```json
{
  "success": false,
  "message": "Review not found or access denied",
  "errors": [
    {
      "field": "id",
      "message": "You do not have access to this review",
      "code": "ACCESS_DENIED"
    }
  ]
}
```

- **HTTP Status Codes**: `200`, `400`, `401`, `404`
