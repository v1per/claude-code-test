# Notes REST API

A RESTful API for managing notes built with Node.js, Express, Drizzle ORM, PostgreSQL, and Zod for validation, following **Domain-Driven Design** principles.

## Features

- **User Authentication** with JWT tokens
- User registration and login
- Full CRUD operations for notes
- **Domain-Driven Design (DDD)** architecture
- Separation of concerns with layered architecture
- PostgreSQL database with Drizzle ORM
- Data validation using Zod
- Password hashing with bcryptjs
- TypeScript for type safety
- Dependency injection for loose coupling
- RESTful API design

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL connection string and JWT secret:
```
DATABASE_URL=postgresql://username:password@localhost:5432/notes_db
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Database Setup

1. Generate migration files:
```bash
npm run db:generate
```

2. Run migrations:
```bash
npm run db:migrate
```

Alternatively, you can push the schema directly without migrations:
```bash
npm run db:push
```

## Running the Application

### Development mode (with hot reload):
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## Testing

This project includes comprehensive test coverage:
- **Unit Tests**: Domain entities and application use cases with mocked dependencies
- **Integration Tests**: Infrastructure layer (repositories) using a real PostgreSQL database

### Prerequisites for Testing

- PostgreSQL server running locally (default: localhost:5432)
- Test database will be created automatically

### Setup Test Environment

1. Copy the test environment file:
```bash
cp .env.test.example .env.test
```

2. Update `.env.test` with your PostgreSQL credentials if different from defaults:
```
TEST_DB_NAME=notes_db_test
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=test-secret-key
```

### Running Tests

```bash
# Run all tests (watch mode)
npm test

# Run all tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run only unit tests (domain + application layers)
npm run test:run -- --exclude='**/infrastructure/**'

# Run only integration tests (infrastructure layer)
npm run test:run -- tests/infrastructure
```

**Test Counts**:
- 82 unit tests (domain + application layers)
- 28 integration tests (infrastructure layer)
- 110 total tests

### Test Structure

**Unit Tests** (domain and application layers):
- `tests/domain/note/note.entity.test.ts` - Note entity business logic tests
- `tests/domain/user/user.entity.test.ts` - User entity business logic tests
- `tests/application/note/use-cases/note.use-cases.test.ts` - Note use case tests with mocked repositories
- `tests/application/user/use-cases/user.use-cases.test.ts` - User use case tests with mocked repositories

**Integration Tests** (infrastructure layer):
- `tests/infrastructure/repositories/user.repository.impl.test.ts` - Tests for UserRepositoryImpl
- `tests/infrastructure/repositories/note.repository.impl.test.ts` - Tests for NoteRepositoryImpl

### What's Tested

**Domain Layer - Unit Tests**:

*Note Entity*:
- ✅ Creating notes with validation
- ✅ Title validation (empty, whitespace, max length)
- ✅ Content validation (empty, whitespace)
- ✅ Updating notes (title, content, both)
- ✅ Authorization checks (isAuthor, verifyAuthorization)
- ✅ Business rule enforcement

*User Entity*:
- ✅ Creating users with validation
- ✅ Email validation and normalization
- ✅ Password hash validation
- ✅ Name validation (length constraints)
- ✅ Updating user properties (name, password hash)
- ✅ Business rule enforcement

**Application Layer - Unit Tests with Mocks**:

*Note Use Cases*:
- ✅ Creating notes (with userId assignment)
- ✅ Updating notes (with authorization checks)
- ✅ Deleting notes (with authorization checks)
- ✅ Getting a single note
- ✅ Getting all notes
- ✅ Error handling (not found, unauthorized access)
- ✅ Repository interaction verification

*User Use Cases*:
- ✅ User sign up (with password hashing, JWT generation)
- ✅ User sign in (with password verification)
- ✅ Email normalization (lowercase, trim)
- ✅ Password strength validation
- ✅ Duplicate email detection
- ✅ Invalid credentials handling
- ✅ JWT token generation with correct payload

**Infrastructure Layer - Integration Tests**:

*UserRepositoryImpl*:
- ✅ Creating users
- ✅ Finding users by ID
- ✅ Finding users by email (case-insensitive)
- ✅ Updating users
- ✅ Deleting users
- ✅ Domain entity mapping

*NoteRepositoryImpl*:
- ✅ Creating notes with user ownership
- ✅ Finding notes by ID
- ✅ Finding all notes (with ordering)
- ✅ Updating notes (title, content, both)
- ✅ Deleting notes
- ✅ Foreign key constraints
- ✅ Domain entity mapping and behavior

### Test Database Management

- Test database is created automatically before tests run
- Tables are cleaned between tests for isolation
- Test database is dropped after all tests complete
- Each test suite runs independently with its own setup/teardown

## API Endpoints

### Authentication Endpoints

Base URL: `http://localhost:3000/api/auth`

#### Sign Up (User Registration)
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Sign In (User Login)
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Authentication Notes**:
- Passwords must be at least 6 characters long
- Emails are stored in lowercase
- JWT tokens expire after 7 days
- Use the returned token in the `Authorization` header for protected routes: `Bearer <token>`

### Notes Endpoints

Base URL: `http://localhost:3000/api/notes`

**Authentication Required**: All note endpoints require a valid JWT token in the Authorization header.

**Authorization Rules**:
- **GET** (List/View): Any authenticated user can view all notes
- **POST** (Create): Authenticated user automatically becomes the note author
- **PUT** (Update): Only the author can update their notes
- **DELETE**: Only the author can delete their notes

#### Get all notes
```
GET /api/notes
Authorization: Bearer <your-jwt-token>
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "My Note",
      "content": "Note content here",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get a single note
```
GET /api/notes/:id
Authorization: Bearer <your-jwt-token>
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "My Note",
    "content": "Note content here",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

#### Create a new note
```
POST /api/notes
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My New Note",
  "content": "This is the content of my note"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "My New Note",
    "content": "This is the content of my note",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

#### Update a note
```
PUT /api/notes/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Note**: Both fields are optional, but at least one must be provided. Only the note author can update.

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Delete a note
```
DELETE /api/notes/:id
Authorization: Bearer <your-jwt-token>
```

**Note**: Only the note author can delete.

Response:
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "My Note",
    "content": "Note content",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

Status codes:
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing or invalid JWT token)
- 403: Forbidden (not authorized to perform this action)
- 404: Not Found
- 409: Conflict (duplicate email during signup)
- 500: Internal Server Error

## Project Structure (Domain-Driven Design)

```
.
├── src/
│   ├── domain/                    # Domain Layer (Business Logic)
│   │   ├── note/
│   │   │   ├── note.entity.ts     # Note entity with business rules
│   │   │   ├── note.repository.ts # Repository interface (port)
│   │   │   └── note.errors.ts     # Domain-specific errors
│   │   ├── user/
│   │   │   ├── user.entity.ts     # User entity with business rules
│   │   │   ├── user.repository.ts # Repository interface (port)
│   │   │   └── user.errors.ts     # Domain-specific errors
│   │   └── shared/
│   │       └── result.ts          # Result type for error handling
│   │
│   ├── application/               # Application Layer (Use Cases)
│   │   ├── note/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-note.use-case.ts
│   │   │   │   ├── update-note.use-case.ts
│   │   │   │   ├── delete-note.use-case.ts
│   │   │   │   ├── get-note.use-case.ts
│   │   │   │   └── get-all-notes.use-case.ts
│   │   │   └── dtos/
│   │   │       ├── create-note.dto.ts
│   │   │       ├── update-note.dto.ts
│   │   │       └── note-response.dto.ts
│   │   └── user/
│   │       ├── use-cases/
│   │       │   ├── sign-up.use-case.ts
│   │       │   └── sign-in.use-case.ts
│   │       └── dtos/
│   │           ├── sign-up.dto.ts
│   │           ├── sign-in.dto.ts
│   │           ├── auth-response.dto.ts
│   │           └── user-response.dto.ts
│   │
│   ├── infrastructure/            # Infrastructure Layer (Technical Details)
│   │   ├── database/
│   │   │   ├── schema.ts          # Drizzle schema definitions (users, notes)
│   │   │   ├── connection.ts      # Database connection
│   │   │   └── migrate.ts         # Migration runner
│   │   └── repositories/
│   │       ├── note.repository.impl.ts  # Note repository implementation
│   │       └── user.repository.impl.ts  # User repository implementation
│   │
│   ├── presentation/              # Presentation Layer (HTTP/API)
│   │   ├── controllers/
│   │   │   ├── note.controller.ts # Note HTTP request handlers
│   │   │   └── user.controller.ts # Auth HTTP request handlers
│   │   ├── routes/
│   │   │   ├── note.routes.ts     # Note route definitions
│   │   │   └── auth.routes.ts     # Auth route definitions
│   │   ├── middlewares/
│   │   │   ├── validation.middleware.ts
│   │   │   └── auth.middleware.ts # JWT authentication
│   │   └── validators/
│   │       ├── note.validator.ts  # Note Zod validation schemas
│   │       └── user.validator.ts  # User Zod validation schemas
│   │
│   ├── config/
│   │   └── container.ts           # Dependency injection container
│   │
│   └── index.ts                   # Application entry point
│
├── drizzle/                       # Generated migration files
├── drizzle.config.ts              # Drizzle configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json
└── README.md
```

## Architecture Overview

This application follows **Domain-Driven Design** principles with a layered architecture:

### 1. Domain Layer
The core business logic layer, containing:
- **Entities**: Business objects with identity (Note, User entities)
- **Repository Interfaces**: Contracts for data persistence (ports)
- **Domain Errors**: Business-specific exceptions
- **Business Rules**: Validation and invariants enforced by entities (password strength, email format, etc.)

### 2. Application Layer
Orchestrates business operations:
- **Use Cases**: Application-specific business rules and workflows (CRUD notes, sign up, sign in)
- **DTOs**: Data Transfer Objects for input/output
- JWT token generation and password hashing
- Coordinates between domain and infrastructure layers

### 3. Infrastructure Layer
Technical implementation details:
- **Database**: Schema definitions and connections
- **Repository Implementations**: Concrete implementations of domain repository interfaces (adapters)
- Persistence and external service integrations

### 4. Presentation Layer
User interface (HTTP API):
- **Controllers**: Handle HTTP requests/responses
- **Routes**: Define API endpoints
- **Validators**: Input validation using Zod
- **Middlewares**: Cross-cutting concerns (validation, error handling, JWT authentication)

### Benefits of This Architecture

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Layers can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Flexibility**: Easy to swap implementations (e.g., different databases)
- **Domain-Centric**: Business logic is independent of technical details

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Technologies

- **Express**: Web framework
- **Drizzle ORM**: TypeScript ORM
- **PostgreSQL**: Database
- **Zod**: Schema validation
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcryptjs**: Password hashing
- **TypeScript**: Type safety
- **tsx**: TypeScript execution for development
- **Vitest**: Testing framework for unit and integration tests
