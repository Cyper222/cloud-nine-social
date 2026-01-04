import type { User, ApiResponse } from '@/types';
import type { LoginRequest, RegisterRequest, AuthUser, ProfileUpdateRequest } from '@/types/auth';
import { currentUser } from './mockData';
import { http, tokenManager } from './http';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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
  bio: authUser.bio,
  isOnline: true,
  friendsCount: 0,
  postsCount: 0,
  createdAt: authUser.created_at,
});

export const authService = {
  // Get current access token
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  // Login with real API
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
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
      
      // Store access token in memory
      const accessToken = data.access_token || data.tokens?.access_token;
      if (accessToken) {
        tokenManager.setAccessToken(accessToken);
      }

      const user = mapAuthUserToUser(data.user);

      return {
        data: { user, token: accessToken },
        success: true,
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to mock for development
      if (credentials.email && credentials.password) {
        const mockToken = 'mock_jwt_token_' + Date.now();
        tokenManager.setAccessToken(mockToken);
        return {
          data: { user: currentUser, token: mockToken },
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
        credentials: 'include',
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
      
      // Store access token
      const accessToken = responseData.access_token || responseData.tokens?.access_token;
      if (accessToken) {
        tokenManager.setAccessToken(accessToken);
      }

      const user = mapAuthUserToUser(responseData.user);

      return {
        data: { user, token: accessToken },
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
        const mockToken = 'mock_jwt_token_' + Date.now();
        tokenManager.setAccessToken(mockToken);
        return {
          data: { user: newUser, token: mockToken },
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
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        tokenManager.clearTokens();
        return false;
      }

      const data = await response.json();
      const accessToken = data.access_token || data.tokens?.access_token;
      
      if (accessToken) {
        tokenManager.setAccessToken(accessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenManager.clearTokens();
      return false;
    }
  },

  // Logout and revoke tokens
  async logout(): Promise<void> {
    try {
      const token = tokenManager.getAccessToken();
      if (token) {
        await fetch(`${API_BASE}/auth/revoke`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Get current user info
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = tokenManager.getAccessToken();
    
    if (!token) {
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
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${tokenManager.getAccessToken()}`,
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
  async updateProfile(updates: ProfileUpdateRequest): Promise<ApiResponse<User>> {
    try {
      const response = await http.request<AuthUser>('/auth/me', {
        method: 'PATCH',
        body: updates,
      });
      
      return {
        data: mapAuthUserToUser(response),
        success: true,
      };
    } catch (error) {
      // Fallback to mock
      const updatedUser = { 
        ...currentUser, 
        ...updates,
        displayName: updates.display_name || currentUser.displayName,
      };
      return {
        data: updatedUser,
        success: true,
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },
};
