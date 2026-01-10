import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services/auth';
import { userCache } from '@/utils/userCache';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

// Загружаем данные из кэша при инициализации
const loadCachedUser = (): User | null => {
  return userCache.get();
};

const initialState = {
  user: loadCachedUser(),
  isAuthenticated: authService.isAuthenticated() || loadCachedUser() !== null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    ...initialState,

    setUser: (user: User | null) => {
      if (user) {
        userCache.set(user);
        set({ user, isAuthenticated: true });
      } else {
        userCache.clear();
        set({ user: null, isAuthenticated: false });
      }
    },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data?.user) {
        // Сначала сохраняем базовые данные из логина
        userCache.set(response.data.user);
        set({ 
          user: response.data.user, 
          isAuthenticated: true, 
          isLoading: true // Продолжаем loading пока загружаем полные данные
        });
        
        // Сразу загружаем полные данные (не в фоне, а синхронно)
        try {
          const fullUserResponse = await authService.getCurrentUser();
          if (fullUserResponse.success && fullUserResponse.data) {
            // Сохраняем полные данные в кэш и store
            userCache.set(fullUserResponse.data);
            set({ 
              user: fullUserResponse.data, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            // Если не удалось загрузить полные данные, используем базовые
            set({ isLoading: false });
          }
        } catch (error) {
          // Если ошибка при загрузке полных данных, используем базовые
          console.warn('Failed to load full user data after login:', error);
          set({ isLoading: false });
        }
        
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
      
      if (response.success && response.data?.user) {
        // Сначала сохраняем базовые данные из регистрации
        userCache.set(response.data.user);
        set({ 
          user: response.data.user, 
          isAuthenticated: true, 
          isLoading: true // Продолжаем loading пока загружаем полные данные
        });
        
        // Сразу загружаем полные данные (не в фоне, а синхронно)
        try {
          const fullUserResponse = await authService.getCurrentUser();
          if (fullUserResponse.success && fullUserResponse.data) {
            // Сохраняем полные данные в кэш и store
            userCache.set(fullUserResponse.data);
            set({ 
              user: fullUserResponse.data, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            // Если не удалось загрузить полные данные, используем базовые
            set({ isLoading: false });
          }
        } catch (error) {
          // Если ошибка при загрузке полных данных, используем базовые
          console.warn('Failed to load full user data after registration:', error);
          set({ isLoading: false });
        }
        
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
    // Очищаем кэш при выходе
    userCache.clear();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    // Проверяем токен
    if (!authService.isAuthenticated()) {
      // Если токена нет, проверяем кэш
      const cachedUser = userCache.get();
      if (cachedUser) {
        // Есть кэш, но нет токена - очищаем кэш
        userCache.clear();
      }
      set({ user: null, isAuthenticated: false });
      return null;
    }
    
    // Проверяем кэш перед запросом к серверу
    const cachedUser = userCache.get();
    const isCacheExpired = userCache.isExpired();
    
    // Если есть валидный кэш, используем его немедленно
    if (cachedUser && !isCacheExpired) {
      set({ user: cachedUser, isAuthenticated: true, isLoading: false });
      
      // Обновляем данные в фоне, если кэш скоро истечет (более 80% TTL прошло)
      const cacheAge = userCache.getAge();
      const ttl = userCache.getTtl();
      if (cacheAge !== null && ttl !== null && cacheAge > ttl * 0.8) {
        // Обновляем в фоне, но не показываем loading
        authService.getCurrentUser()
          .then((response) => {
            if (response.success && response.data) {
              userCache.set(response.data);
              set({ user: response.data });
            }
          })
          .catch(() => {
            // Игнорируем ошибки фонового обновления
          });
      }
      
      return cachedUser;
    }
    
    // Если кэш истек или отсутствует, загружаем с сервера
    set({ isLoading: true });
    
    try {
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data) {
        // Сохраняем в кэш
        userCache.set(response.data);
        set({ user: response.data, isAuthenticated: true, isLoading: false });
        return response.data;
      } else {
        // Если запрос не удался, но есть устаревший кэш - используем его
        if (cachedUser) {
          set({ user: cachedUser, isAuthenticated: true, isLoading: false });
          return cachedUser;
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
        return null;
      }
    } catch (error) {
      // При ошибке сети используем кэш, если он есть
      if (cachedUser) {
        set({ user: cachedUser, isAuthenticated: true, isLoading: false });
        return cachedUser;
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
  })
);
