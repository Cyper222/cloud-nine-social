import type { User, ApiResponse } from '@/types';
import type { LoginRequest, RegisterRequest, AuthTokens, AuthUser } from '@/types/auth';
import { currentUser } from './mockData';
import { api } from './api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Token storage in memory (NOT localStorage for access token)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

// Helper to convert API user to app User type
const mapAuthUserToUser = (authUser: AuthUser): User => ({
  id: authUser.id,
  username: authUser.username,
  displayName: authUser.display_name || authUser.username,
  email: authUser.email,
  avatar: authUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  isOnline: true,
  friendsCount: 0,
  postsCount: 0,
  createdAt: authUser.created_at,
});

export const authService = {
  // Get current access token
  getAccessToken(): string | null {
    return accessToken;
  },

  // Set tokens after successful auth
  setTokens(tokens: AuthTokens): void {
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    // Store refresh token in sessionStorage (more secure than localStorage)
    sessionStorage.setItem('refresh_token', tokens.refresh_token);
  },

  // Clear all tokens
  clearTokens(): void {
    accessToken = null;
    refreshToken = null;
    sessionStorage.removeItem('refresh_token');
  },

  // Login with real API
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        } as LoginRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          data: null as unknown as AuthResponseData,
          success: false,
          message: error.message || 'Неверный email или пароль',
        };
      }

      const data = await response.json();
      
      // Store tokens
      this.setTokens(data.tokens);

      const user = mapAuthUserToUser(data.user);

      return {
        data: { user, token: data.tokens.access_token },
        success: true,
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to mock for development
      if (credentials.email && credentials.password) {
        accessToken = 'mock_jwt_token_' + Date.now();
        return {
          data: { user: currentUser, token: accessToken },
          success: true,
        };
      }

      return {
        data: null as unknown as AuthResponseData,
        success: false,
        message: 'Ошибка подключения к серверу',
      };
    }
  },

  // Register with real API
  async register(data: RegisterData): Promise<ApiResponse<AuthResponseData>> {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        } as RegisterRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          data: null as unknown as AuthResponseData,
          success: false,
          message: error.message || 'Ошибка регистрации',
        };
      }

      const responseData = await response.json();
      
      // Store tokens
      this.setTokens(responseData.tokens);

      const user = mapAuthUserToUser(responseData.user);

      return {
        data: { user, token: responseData.tokens.access_token },
        success: true,
      };
    } catch (error) {
      console.error('Register error:', error);
      
      // Fallback to mock for development
      if (data.email && data.password && data.username) {
        const newUser: User = {
          ...currentUser,
          id: Date.now().toString(),
          username: data.username,
          displayName: data.displayName || data.username,
          email: data.email,
        };
        accessToken = 'mock_jwt_token_' + Date.now();
        return {
          data: { user: newUser, token: accessToken },
          success: true,
        };
      }

      return {
        data: null as unknown as AuthResponseData,
        success: false,
        message: 'Ошибка подключения к серверу',
      };
    }
  },

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    const storedRefreshToken = refreshToken || sessionStorage.getItem('refresh_token');
    
    if (!storedRefreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.tokens);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return false;
    }
  },

  // Logout and revoke tokens
  async logout(): Promise<void> {
    try {
      if (accessToken) {
        await fetch(`${API_BASE}/auth/revoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  },

  // Get current user info
  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (!accessToken) {
      // Try to refresh token
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        return {
          data: null as unknown as User,
          success: false,
          message: 'Не авторизован',
        };
      }
    }

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return {
          data: null as unknown as User,
          success: false,
          message: 'Не авторизован',
        };
      }

      const data = await response.json();
      return {
        data: mapAuthUserToUser(data),
        success: true,
      };
    } catch (error) {
      // Fallback to mock user for development
      return {
        data: currentUser,
        success: true,
      };
    }
  },

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    const updatedUser = { ...currentUser, ...updates };
    return {
      data: updatedUser,
      success: true,
    };
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!accessToken || !!sessionStorage.getItem('refresh_token');
  },
};
