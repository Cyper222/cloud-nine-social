import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        set({ 
          user: response.data.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true;
      } else {
        set({ error: response.message || 'Ошибка входа', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Произошла ошибка', isLoading: false });
      return false;
    }
  },

  register: async (username, email, password, displayName) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.register({ username, email, password, displayName });
      
      if (response.success) {
        set({ 
          user: response.data.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true;
      } else {
        set({ error: response.message || 'Ошибка регистрации', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Произошла ошибка', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    
    set({ isLoading: true });
    
    try {
      const response = await authService.getCurrentUser();
      
      if (response.success) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
