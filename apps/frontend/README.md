# Notes App - Frontend

React frontend application for the Notes App, built with Vite, TypeScript, and TailwindCSS.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client

## Features

- 🔐 User authentication (Sign up / Sign in)
- 📝 CRUD operations for notes
- 🎨 Modern, responsive UI with TailwindCSS
- 🔒 Protected routes for authenticated users
- ⚡ Fast development with Vite HMR
- 📱 Mobile-friendly design
- 🎯 TypeScript for type safety

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Backend API running on `http://localhost:3000`

## Installation

From the repository root:

```bash
# Install all dependencies
pnpm install
```

## Environment Variables

Create a `.env` file in `apps/frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

Or copy from the example:

```bash
cp .env.example .env
```

## Development

```bash
# From repository root
pnpm dev:frontend

# Or from apps/frontend directory
pnpm dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
# From repository root
pnpm build:frontend

# Or from apps/frontend directory
pnpm build
```

Build output will be in `apps/frontend/dist/`

## Preview Production Build

```bash
# From apps/frontend directory
pnpm preview
```

## Project Structure

```
apps/frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Loading.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── Notes.tsx
│   │   ├── NoteDetail.tsx
│   │   └── NoteForm.tsx
│   ├── services/        # API services
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── notes.service.ts
│   ├── store/           # State management
│   │   └── authStore.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## Available Routes

- `/` - Home page
- `/login` - Login page
- `/signup` - Sign up page
- `/notes` - Notes list (protected)
- `/notes/new` - Create new note (protected)
- `/notes/:id` - View note details (protected)
- `/notes/:id/edit` - Edit note (protected)

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api`

API endpoints:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## State Management

Uses Zustand for lightweight state management:

```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

## Authentication

- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Auto-redirect to login on 401 responses
- Protected routes for authenticated users

## Styling

Uses TailwindCSS with custom utility classes:

- `btn-primary` - Primary button style
- `btn-secondary` - Secondary button style
- `btn-danger` - Danger/delete button style
- `input-field` - Form input style
- `card` - Card container style

## Type Safety

Full TypeScript support with interfaces for:
- API responses
- Form data
- User and Note entities
- Store state

## Development Tips

1. **API Proxy**: Vite is configured to proxy `/api` requests to `http://localhost:3000`
2. **Path Aliases**: Use `@/` to import from `src/` directory
3. **Hot Module Replacement**: Changes reflect instantly during development
4. **Type Checking**: Run `pnpm type-check` to check TypeScript errors

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # Check TypeScript types
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features required

## License

MIT
