# Notes REST API

A RESTful API for managing notes built with Node.js, Express, Drizzle ORM, PostgreSQL, and Zod for validation.

## Features

- Full CRUD operations for notes
- PostgreSQL database with Drizzle ORM
- Data validation using Zod
- TypeScript for type safety
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

## Project Structure

```
.
├── src/
│   ├── db/
│   │   ├── index.ts         # Database connection
│   │   ├── schema.ts        # Drizzle schema definitions
│   │   └── migrate.ts       # Migration runner
│   ├── routes/
│   │   └── notes.ts         # Notes route handlers
│   ├── validators/
│   │   └── notes.ts         # Zod validation schemas
│   └── index.ts             # Express app entry point
├── drizzle/                 # Generated migration files
├── drizzle.config.ts        # Drizzle configuration
├── tsconfig.json            # TypeScript configuration
├── package.json
└── README.md
```

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
