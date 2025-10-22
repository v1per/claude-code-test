# Notes REST API

A RESTful API for managing notes built with Node.js, Express, Drizzle ORM, PostgreSQL, and Zod for validation, following **Domain-Driven Design** principles.

## Features

- Full CRUD operations for notes
- **Domain-Driven Design (DDD)** architecture
- Separation of concerns with layered architecture
- PostgreSQL database with Drizzle ORM
- Data validation using Zod
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

4. Update the `.env` file with your PostgreSQL connection string:
```
DATABASE_URL=postgresql://username:password@localhost:5432/notes_db
PORT=3000
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

## API Endpoints

Base URL: `http://localhost:3000/api/notes`

### Get all notes
```
GET /api/notes
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My Note",
      "content": "Note content here",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

### Get a single note
```
GET /api/notes/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My Note",
    "content": "Note content here",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

### Create a new note
```
POST /api/notes
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
    "title": "My New Note",
    "content": "This is the content of my note",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

### Update a note
```
PUT /api/notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

Note: Both fields are optional, but at least one must be provided.

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Delete a note
```
DELETE /api/notes/:id
```

Response:
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 1,
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
- 404: Not Found
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
│   │   └── shared/
│   │       └── result.ts          # Result type for error handling
│   │
│   ├── application/               # Application Layer (Use Cases)
│   │   └── note/
│   │       ├── use-cases/
│   │       │   ├── create-note.use-case.ts
│   │       │   ├── update-note.use-case.ts
│   │       │   ├── delete-note.use-case.ts
│   │       │   ├── get-note.use-case.ts
│   │       │   └── get-all-notes.use-case.ts
│   │       └── dtos/
│   │           ├── create-note.dto.ts
│   │           ├── update-note.dto.ts
│   │           └── note-response.dto.ts
│   │
│   ├── infrastructure/            # Infrastructure Layer (Technical Details)
│   │   ├── database/
│   │   │   ├── schema.ts          # Drizzle schema definitions
│   │   │   ├── connection.ts      # Database connection
│   │   │   └── migrate.ts         # Migration runner
│   │   └── repositories/
│   │       └── note.repository.impl.ts  # Repository implementation (adapter)
│   │
│   ├── presentation/              # Presentation Layer (HTTP/API)
│   │   ├── controllers/
│   │   │   └── note.controller.ts # HTTP request handlers
│   │   ├── routes/
│   │   │   └── note.routes.ts     # Route definitions
│   │   ├── middlewares/
│   │   │   └── validation.middleware.ts
│   │   └── validators/
│   │       └── note.validator.ts  # Zod validation schemas
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
- **Entities**: Business objects with identity (Note entity)
- **Repository Interfaces**: Contracts for data persistence (ports)
- **Domain Errors**: Business-specific exceptions
- **Business Rules**: Validation and invariants enforced by entities

### 2. Application Layer
Orchestrates business operations:
- **Use Cases**: Application-specific business rules and workflows
- **DTOs**: Data Transfer Objects for input/output
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
- **Middlewares**: Cross-cutting concerns (validation, error handling)

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
- **TypeScript**: Type safety
- **tsx**: TypeScript execution for development
