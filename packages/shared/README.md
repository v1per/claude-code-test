# @notes-app/shared

Shared types, validators, and constants used across the Notes App monorepo.

## Purpose

This package centralizes all shared code between the frontend and backend applications to:
- **Ensure type safety** across the entire stack
- **Maintain consistency** in validation rules
- **Reduce duplication** of type definitions and business rules
- **Single source of truth** for data structures and validation

## Contents

### Types (`/types`)

**User Types** (`user.types.ts`):
- `User` - User entity type
- `UserResponseDTO` - API response DTO
- `SignUpDTO` - Sign up request DTO
- `SignInDTO` - Sign in request DTO

**Note Types** (`note.types.ts`):
- `Note` - Note entity type
- `NoteResponseDTO` - API response DTO
- `CreateNoteDTO` - Create note request DTO
- `UpdateNoteDTO` - Update note request DTO

**API Types** (`api.types.ts`):
- `ApiResponse<T>` - Standard API response wrapper

**Auth Types** (`auth.types.ts`):
- `AuthResponse` - Authentication response type
- `AuthResponseDTO` - Auth response DTO

### Validators (`/validators`)

Zod schemas for runtime validation:

**Note Validators** (`note.validator.ts`):
- `createNoteSchema` - Validates note creation
- `updateNoteSchema` - Validates note updates
- `noteIdSchema` - Validates note ID parameter

**User Validators** (`user.validator.ts`):
- `signUpSchema` - Validates user registration
- `signInSchema` - Validates user login

### Constants (`/constants`)

**Validation Constants** (`validation.ts`):
- `VALIDATION` - Validation rules (min/max lengths, etc.)
- `ERROR_MESSAGES` - Standardized error messages

## Usage

### In Backend

```typescript
import {
  User,
  Note,
  createNoteSchema,
  signUpSchema,
  VALIDATION
} from '@notes-app/shared';

// Use for validation
const result = createNoteSchema.safeParse(requestBody);

// Use types
const user: User = {
  id: 1,
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date()
};
```

### In Frontend

```typescript
import {
  User,
  Note,
  ApiResponse,
  AuthResponse,
  CreateNoteDTO
} from '@notes-app/shared';

// Use types for API responses
const response: ApiResponse<Note[]> = await api.get('/notes');

// Use types for state
const [user, setUser] = useState<User | null>(null);
```

## Building

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type check
pnpm type-check
```

## Dependencies

- **zod** - Runtime validation schemas
- **tsup** - TypeScript bundler for build

## Benefits

1. **Type Safety**: TypeScript ensures frontend and backend use the same types
2. **Validation Consistency**: Same validation rules on both client and server
3. **DRY Principle**: Write types and validators once, use everywhere
4. **Refactoring Safety**: Changes to types propagate to all consumers
5. **Documentation**: Types serve as API documentation

## Development

When adding new shared code:

1. Add types to appropriate file in `/types`
2. Add validators to appropriate file in `/validators`
3. Add constants to `/constants/validation.ts`
4. Export from `/index.ts`
5. Run `pnpm build` to generate distribution files
6. Both frontend and backend will have access to the new exports
