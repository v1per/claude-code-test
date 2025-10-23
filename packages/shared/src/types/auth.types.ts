/**
 * Authentication Type Definitions
 * Shared between frontend and backend
 */

import type { User } from './user.types';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthResponseDTO {
  user: {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
  };
  token: string;
}
