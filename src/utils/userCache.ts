import type { User } from '@/types';

const USER_CACHE_KEY = 'user_cache';
const USER_CACHE_TTL = 5 * 60 * 1000; // 5 минут в миллисекундах

interface CachedUser {
  user: User;
  timestamp: number;
  ttl: number;
}

/**
 * Утилита для работы с кэшем пользователя в localStorage
 */
export const userCache = {
  /**
   * Сохранить данные пользователя в кэш
   */
  set(user: User, ttl: number = USER_CACHE_TTL): void {
    try {
      const cached: CachedUser = {
        user,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
      console.warn('Failed to cache user data:', error);
    }
  },

  /**
   * Получить данные пользователя из кэша
   * Возвращает null, если кэш истек или отсутствует
   */
  get(): User | null {
    try {
      const cachedStr = localStorage.getItem(USER_CACHE_KEY);
      if (!cachedStr) {
        return null;
      }

      const cached: CachedUser = JSON.parse(cachedStr);
      const now = Date.now();
      const age = now - cached.timestamp;

      // Проверяем, не истек ли кэш
      if (age > cached.ttl) {
        // Кэш истек, удаляем его
        localStorage.removeItem(USER_CACHE_KEY);
        return null;
      }

      return cached.user;
    } catch (error) {
      console.warn('Failed to get cached user data:', error);
      // При ошибке парсинга удаляем невалидный кэш
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
  },

  /**
   * Проверить, существует ли валидный кэш
   */
  hasValidCache(): boolean {
    const user = this.get();
    return user !== null;
  },

  /**
   * Проверить, истек ли кэш (но не удалять его)
   */
  isExpired(): boolean {
    try {
      const cachedStr = localStorage.getItem(USER_CACHE_KEY);
      if (!cachedStr) {
        return true;
      }

      const cached: CachedUser = JSON.parse(cachedStr);
      const now = Date.now();
      const age = now - cached.timestamp;

      return age > cached.ttl;
    } catch {
      return true;
    }
  },

  /**
   * Получить возраст кэша в миллисекундах
   */
  getAge(): number | null {
    try {
      const cachedStr = localStorage.getItem(USER_CACHE_KEY);
      if (!cachedStr) {
        return null;
      }

      const cached: CachedUser = JSON.parse(cachedStr);
      return Date.now() - cached.timestamp;
    } catch {
      return null;
    }
  },

  /**
   * Получить TTL кэша
   */
  getTtl(): number | null {
    try {
      const cachedStr = localStorage.getItem(USER_CACHE_KEY);
      if (!cachedStr) {
        return null;
      }

      const cached: CachedUser = JSON.parse(cachedStr);
      return cached.ttl;
    } catch {
      return null;
    }
  },

  /**
   * Очистить кэш
   */
  clear(): void {
    try {
      localStorage.removeItem(USER_CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear user cache:', error);
    }
  },

  /**
   * Обновить TTL существующего кэша (продлить срок действия)
   */
  refreshTtl(ttl: number = USER_CACHE_TTL): void {
    const user = this.get();
    if (user) {
      this.set(user, ttl);
    }
  },

  /**
   * Обновить данные пользователя в кэше (без изменения TTL)
   */
  update(user: User): void {
    try {
      const cachedStr = localStorage.getItem(USER_CACHE_KEY);
      if (cachedStr) {
        const cached: CachedUser = JSON.parse(cachedStr);
        // Сохраняем с тем же TTL и timestamp
        cached.user = user;
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cached));
      } else {
        // Если кэша нет, создаем новый
        this.set(user);
      }
    } catch (error) {
      console.warn('Failed to update cached user data:', error);
      // При ошибке создаем новый кэш
      this.set(user);
    }
  },
};

