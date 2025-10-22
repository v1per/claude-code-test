import api from './api';
import type { ApiResponse, AuthResponse, SignUpFormData, SignInFormData } from '@/types';

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpFormData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/signup', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Sign up failed');
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInFormData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/signin', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Sign in failed');
  }

  /**
   * Store auth data in localStorage
   */
  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }

  /**
   * Get stored auth data
   */
  getAuthData(): { token: string | null; user: string | null } {
    return {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
    };
  }

  /**
   * Clear auth data
   */
  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
