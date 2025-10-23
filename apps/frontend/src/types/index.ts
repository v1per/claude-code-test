/**
 * Type Definitions
 * Re-exports from shared package + frontend-specific types
 */

// Re-export shared types
export type {
  User,
  Note,
  AuthResponse,
  ApiResponse,
  SignUpDTO as SignUpFormData,
  SignInDTO as SignInFormData,
  CreateNoteDTO as CreateNoteFormData,
  UpdateNoteDTO as UpdateNoteFormData,
} from '@notes-app/shared';

/**
 * Frontend-specific Store Types
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Need to import User type for AuthState
import type { User } from '@notes-app/shared';
