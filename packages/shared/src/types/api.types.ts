/**
 * API Response Type Definitions
 * Shared between frontend and backend
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string[];
}
