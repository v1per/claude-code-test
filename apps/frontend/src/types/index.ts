/**
 * API Response Types
 */

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string[];
}

/**
 * Form Types
 */

export interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface CreateNoteFormData {
  title: string;
  content: string;
}

export interface UpdateNoteFormData {
  title?: string;
  content?: string;
}

/**
 * Store Types
 */

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
