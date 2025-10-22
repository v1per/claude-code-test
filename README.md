# Notes App Monorepo

A full-stack notes application using pnpm workspaces. This monorepo contains both the backend REST API and frontend application.

## 📦 Monorepo Structure

```
notes-app-monorepo/
├── apps/
│   ├── backend/          # Node.js/Express REST API
│   └── frontend/         # React.js frontend (coming soon)
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── package.json          # Root package.json with monorepo scripts
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher) - Install with `npm install -g pnpm`
- PostgreSQL database

### Installation

1. Clone the repository
2. Install all dependencies:
```bash
pnpm install
```

This will install dependencies for all workspace packages.

### Development

```bash
# Run backend in development mode
pnpm dev

# Or explicitly
pnpm dev:backend

# Run tests
pnpm test

# Run backend tests only
pnpm test:backend
```

## 📚 Applications

### Backend API

A RESTful API for managing notes with user authentication.

**Tech Stack:**
- Node.js + Express
- PostgreSQL + Drizzle ORM
- TypeScript
- JWT Authentication
- Zod Validation
- Vitest (Testing)

**Features:**
- User authentication (sign up/sign in)
- Full CRUD operations for notes
- Domain-Driven Design architecture
- Comprehensive test coverage (110 tests)

[📖 Backend Documentation](./apps/backend/README.md)

### Frontend (Coming Soon)

React.js application for the notes interface.

**Planned Tech Stack:**
- React.js
- TypeScript
- Vite
- TailwindCSS or similar

## 🛠️ Available Scripts

### Root-level Commands

Run these from the repository root:

```bash
# Development
pnpm dev                 # Start backend in dev mode
pnpm dev:backend        # Start backend in dev mode (explicit)

# Build
pnpm build              # Build all apps
pnpm build:backend      # Build backend only

# Start Production
pnpm start:backend      # Start backend in production mode

# Testing
pnpm test               # Run all tests in all apps
pnpm test:backend       # Run backend tests
pnpm test:run           # Run all tests once (no watch)
pnpm test:ui            # Run backend tests with UI

# Database (Backend)
pnpm db:generate        # Generate database migrations
pnpm db:migrate         # Run database migrations
pnpm db:push            # Push schema changes directly
pnpm db:studio          # Open Drizzle Studio
```

### Workspace-specific Commands

Run commands in specific workspaces:

```bash
# Generic format
pnpm --filter <workspace-name> <script>

# Examples
pnpm --filter @notes-app/backend dev
pnpm --filter @notes-app/backend test
pnpm --filter @notes-app/backend build
```

## 📖 Workspace Packages

| Package | Description | Location |
|---------|-------------|----------|
| `@notes-app/backend` | REST API backend | `apps/backend` |
| `@notes-app/frontend` | React frontend (coming soon) | `apps/frontend` |

## 🔧 Monorepo Management

This project uses [pnpm workspaces](https://pnpm.io/workspaces) for monorepo management.

### Adding a New Package

1. Create a new directory in `apps/`
2. Add a `package.json` with a name like `@notes-app/package-name`
3. Run `pnpm install` from the root

### Installing Dependencies

```bash
# Install for all workspaces
pnpm install

# Install for specific workspace
pnpm --filter @notes-app/backend add <package-name>

# Install dev dependency for specific workspace
pnpm --filter @notes-app/backend add -D <package-name>

# Install dependency at root (for tooling)
pnpm add -w <package-name>
```

### Running Scripts

```bash
# Run script in all workspaces
pnpm -r <script-name>

# Run script in specific workspace
pnpm --filter <workspace-name> <script-name>
```

## 🧪 Testing

The monorepo includes comprehensive testing:

- **Backend**: 110 tests (82 unit + 28 integration)
  - Domain layer unit tests
  - Application layer unit tests with mocks
  - Infrastructure layer integration tests

See [Backend Testing Documentation](./apps/backend/README.md#testing) for details.

## 🏗️ Architecture

### Backend Architecture (DDD)

The backend follows Domain-Driven Design principles:

- **Domain Layer**: Business logic and entities
- **Application Layer**: Use cases and orchestration
- **Infrastructure Layer**: Database and external services
- **Presentation Layer**: HTTP API and routes

See [Backend Architecture Documentation](./apps/backend/README.md#architecture-overview) for details.

## 📝 Environment Variables

Each application has its own environment variables:

**Backend** (`apps/backend/.env`):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/notes_db
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
```

Copy the example files:
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/backend/.env.test.example apps/backend/.env.test
```

## 🤝 Contributing

When contributing to this monorepo:

1. Run `pnpm install` at the root to install all dependencies
2. Follow the existing code style and architecture patterns
3. Add tests for new features
4. Ensure all tests pass: `pnpm test`
5. Build all packages: `pnpm build`

## 📄 License

MIT

## 🔗 Links

- [Backend API Documentation](./apps/backend/README.md)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
