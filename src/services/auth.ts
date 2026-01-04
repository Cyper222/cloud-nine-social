import type { User, ApiResponse } from '@/types';
import { currentUser } from './mockData';
import { delay } from './api';

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

export interface AuthResponse {
  user: User;
  token: string;
}

// Mock auth service - ready for backend connection

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay(800);
    
    // Mock validation
    if (credentials.email === 'demo@clouds.app' && credentials.password === 'password') {
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('auth_token', token);
      
      return {
        data: { user: currentUser, token },
        success: true,
      };
    }
    
    // For demo, accept any email/password
    if (credentials.email && credentials.password) {
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('auth_token', token);
      
      return {
        data: { user: currentUser, token },
        success: true,
      };
    }
    
    return {
      data: null as unknown as AuthResponse,
      success: false,
      message: 'Неверный email или пароль',
    };
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    await delay(1000);
    
    // Mock validation
    if (!data.email || !data.password || !data.username) {
      return {
        data: null as unknown as AuthResponse,
        success: false,
        message: 'Заполните все обязательные поля',
      };
    }
    
    // Mock user creation
    const newUser: User = {
      ...currentUser,
      id: Date.now().toString(),
      username: data.username,
      displayName: data.displayName || data.username,
      email: data.email,
    };
    
    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('auth_token', token);
    
    return {
      data: { user: newUser, token },
      success: true,
    };
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem('auth_token');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(300);
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {
        data: null as unknown as User,
        success: false,
        message: 'Не авторизован',
      };
    }
    
    return {
      data: currentUser,
      success: true,
    };
  },

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    await delay(500);
    
    const updatedUser = { ...currentUser, ...updates };
    
    return {
      data: updatedUser,
      success: true,
    };
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};
