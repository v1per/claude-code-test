/**
 * User Type Definitions
 * Shared between frontend and backend
 */

/**
 * User - Frontend API Response Type
 * Dates as strings (JSON serialized)
 */
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * UserResponseDTO - Backend DTO Type
 * Dates as Date objects before serialization
 */
export interface UserResponseDTO {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

export interface SignUpDTO {
  email: string;
  password: string;
  name: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}
