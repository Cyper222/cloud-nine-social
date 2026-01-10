import type { User, ApiResponse } from '@/types';
import type { LoginRequest, RegisterRequest, AuthUser, ProfileUpdateRequest } from '@/types/auth';
import { http, tokenManager } from './http';

interface UserProfileRead {
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | Date | null; // Может быть string или Date объект
  phone_number?: string | null;
  address?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}

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
  birthday: undefined,
  phoneNumber: undefined,
  address: undefined,
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
      
      // Store tokens in memory and localStorage immediately
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const sessionId = data.session_id;
      if (accessToken) {
        // Сохраняем токены синхронно
        tokenManager.setTokens(accessToken, refreshToken || null);
      }
      // Сохраняем session_id для определения текущей сессии
      if (sessionId) {
        localStorage.setItem('current_session_id', sessionId);
      }

      const user = mapAuthUserToUser(data.user);

      return {
        data: { user, token: accessToken },
        success: true,
      };
    } catch (error) {
      console.error('Login error:', error);
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
      
      // Store tokens
      const accessToken = responseData.access_token;
      const refreshToken = responseData.refresh_token;
      const sessionId = responseData.session_id;
      if (accessToken) {
        tokenManager.setTokens(accessToken, refreshToken || null);
      }
      // Сохраняем session_id для определения текущей сессии
      if (sessionId) {
        localStorage.setItem('current_session_id', sessionId);
      }

      const user = mapAuthUserToUser(responseData.user);

      return {
        data: { user, token: accessToken },
        success: true,
      };
    } catch (error) {
      console.error('Register error:', error);
      
      // Не используем fallback на mock - возвращаем ошибку

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
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      
      if (accessToken) {
        tokenManager.setTokens(accessToken, refreshToken || tokenManager.getRefreshToken());
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
      const refreshToken = tokenManager.getRefreshToken();
      const accessToken = tokenManager.getAccessToken();
      
      if (refreshToken || accessToken) {
        try {
          await fetch(`${API_BASE}/auth/revoke`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
            },
            body: refreshToken ? JSON.stringify({ refresh_token: refreshToken }) : undefined,
          });
        } catch (error) {
          // Игнорируем ошибки при revoke, все равно очищаем токены
          console.warn('Revoke session error (ignored):', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      localStorage.removeItem('current_session_id');
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
      // Получаем актуальный токен
      const currentToken = tokenManager.getAccessToken();
      if (!currentToken) {
        return {
          data: null as unknown as User,
          success: false,
          message: 'Токен не найден',
        };
      }

      // Получаем базовую информацию пользователя
      const authResponse = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!authResponse.ok) {
        return {
          data: null as unknown as User,
          success: false,
          message: 'Не авторизован',
        };
      }

      const authData = await authResponse.json();
      let user = mapAuthUserToUser(authData);

      // Получаем расширенную информацию профиля
      try {
        const profileResponse = await http.request<UserProfileRead>('/user/me', {
          method: 'GET',
        });
        
        // Преобразуем birthday в строку если нужно
        let birthdayStr: string | undefined = undefined;
        if (profileResponse.birthday) {
          if (typeof profileResponse.birthday === 'string') {
            birthdayStr = profileResponse.birthday;
          } else if (typeof profileResponse.birthday === 'object' && profileResponse.birthday !== null) {
            // Если это date объект, преобразуем в ISO строку (YYYY-MM-DD)
            const dateObj = profileResponse.birthday as any;
            if (typeof dateObj.isoformat === 'function') {
              birthdayStr = dateObj.isoformat();
            } else if (typeof dateObj.toISOString === 'function') {
              birthdayStr = dateObj.toISOString().split('T')[0];
            } else if (dateObj.year && dateObj.month && dateObj.day) {
              // Если это date объект с полями year, month, day
              birthdayStr = `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
            } else {
              birthdayStr = String(profileResponse.birthday).split('T')[0] || String(profileResponse.birthday);
            }
          }
        }
        
        // Объединяем данные профиля с базовыми данными
        // Используем данные из /user/me напрямую (они уже сохранены в БД)
        // avatar_url уже содержит presigned URL (генерируется в UserService.get_me) или null
        const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop';
        user = {
          ...user,
          displayName: `${profileResponse.first_name || ''} ${profileResponse.last_name || ''}`.trim() || user.displayName || user.username,
          // Если avatar_url есть (не null и не undefined), используем его, иначе дефолтный
          avatar: profileResponse.avatar_url || user.avatar || defaultAvatar,
          bio: profileResponse.bio !== null && profileResponse.bio !== undefined ? profileResponse.bio : (user.bio || ''),
          birthday: birthdayStr || user.birthday,
          phoneNumber: profileResponse.phone_number || user.phoneNumber,
          address: profileResponse.address || user.address,
        };
      } catch (profileError) {
        // Если профиль не найден, используем только базовые данные
        console.warn('Profile not found, using basic user data');
      }

      return {
        data: user,
        success: true,
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      return {
        data: null as unknown as User,
        success: false,
        message: 'Ошибка загрузки данных пользователя',
      };
    }
  },

  // Update user profile
  async updateProfile(updates: ProfileUpdateRequest): Promise<ApiResponse<User>> {
    try {
      // Проверяем токен перед запросом
      const token = tokenManager.getAccessToken();
      if (!token) {
        return {
          data: null as unknown as User,
          success: false,
          message: 'Не авторизован. Пожалуйста, войдите снова.',
        };
      }

      // Делаем PATCH запрос - сервер возвращает обновленные данные профиля из БД
      // Это единственный запрос, который возвращает актуальные данные сразу после сохранения
      const profileResponse = await http.request<UserProfileRead>('/user/me', {
        method: 'PATCH',
        body: updates,
      });
      
      // Получаем базовые данные пользователя (username, email) из /auth/me
      // Эти данные не меняются при обновлении профиля, но нужны для создания полного User объекта
      // Делаем запрос синхронно, чтобы получить актуальные данные
      const authResponse = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!authResponse.ok) {
        return {
          data: null as unknown as User,
          success: false,
          message: 'Не удалось загрузить данные пользователя',
        };
      }

      const authData = await authResponse.json();
      const baseUser = mapAuthUserToUser(authData);
      
      // Создаем обновленный User объект, используя данные из PATCH ответа
      // Важно: PATCH ответ содержит ОБНОВЛЕННЫЕ данные из БД, используем их напрямую
      const updatedUser: User = {
        ...baseUser,
        displayName: `${profileResponse.first_name || ''} ${profileResponse.last_name || ''}`.trim() || baseUser.displayName || baseUser.username,
        avatar: profileResponse.avatar_url !== null ? profileResponse.avatar_url : baseUser.avatar,
        // Используем данные из PATCH ответа напрямую - они уже сохранены в БД
        // PATCH ответ возвращает ВСЕ поля профиля после обновления, используем их напрямую
        bio: profileResponse.bio !== null && profileResponse.bio !== undefined ? profileResponse.bio : '',
        // Преобразуем birthday в строку если нужно
        birthday: profileResponse.birthday 
          ? (typeof profileResponse.birthday === 'string' 
              ? profileResponse.birthday 
              : (profileResponse.birthday as any)?.isoformat?.() || String(profileResponse.birthday).split('T')[0] || String(profileResponse.birthday))
          : undefined,
        phoneNumber: profileResponse.phone_number || undefined,
        address: profileResponse.address || undefined,
      };
      
      return {
        data: updatedUser,
        success: true,
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      // Если ошибка авторизации, возвращаем ошибку вместо fallback
      if (error.message?.includes('Session expired') || error.message?.includes('401')) {
        return {
          data: null as unknown as User,
          success: false,
          message: 'Сессия истекла. Пожалуйста, войдите снова.',
        };
      }
      
      return {
        data: null as unknown as User,
        success: false,
        message: error.message || 'Не удалось обновить профиль',
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },
};
