// HTTP Client with automatic token refresh and retry logic

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Load tokens from localStorage on initialization
let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Initialize tokens from localStorage
const initTokens = () => {
  try {
    accessToken = localStorage.getItem('access_token');
    refreshToken = localStorage.getItem('refresh_token');
  } catch (e) {
    // localStorage may not be available
    accessToken = null;
    refreshToken = null;
  }
};
initTokens();

// Token management
export const tokenManager = {
  getAccessToken: () => {
    // Всегда проверяем localStorage, если токен не в памяти
    if (!accessToken) {
      try {
        accessToken = localStorage.getItem('access_token');
      } catch (e) {
        // localStorage недоступен
      }
    }
    return accessToken;
  },
  
  getRefreshToken: () => refreshToken,
  
  setAccessToken: (token: string | null) => {
    accessToken = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  },
  
  setRefreshToken: (token: string | null) => {
    refreshToken = token;
    if (token) {
      localStorage.setItem('refresh_token', token);
    } else {
      localStorage.removeItem('refresh_token');
    }
  },
  
  setTokens: (access: string | null, refresh: string | null) => {
    accessToken = access;
    refreshToken = refresh;
    if (access) {
      localStorage.setItem('access_token', access);
    } else {
      localStorage.removeItem('access_token');
    }
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    } else {
      localStorage.removeItem('refresh_token');
    }
  },
  
  clearTokens: () => {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// Subscribe to token refresh
const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers about new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Refresh access token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Important: include httpOnly cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    const newToken = data.access_token || data.tokens?.access_token;
    const newRefreshToken = data.refresh_token || data.tokens?.refresh_token;
    
    if (newToken) {
      tokenManager.setTokens(newToken, newRefreshToken || tokenManager.getRefreshToken());
      return newToken;
    }
    
    throw new Error('No token in response');
  } catch (error) {
    tokenManager.clearTokens();
    return null;
  }
};

interface HttpOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string>;
  skipAuth?: boolean;
}

// Main HTTP client
export const http = {
  async request<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    const { body, params, skipAuth = false, ...fetchOptions } = options;

    let url = `${API_BASE}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available and not skipped
    if (!skipAuth) {
      // Всегда получаем токен из tokenManager (который синхронизирован с localStorage)
      const currentToken = tokenManager.getAccessToken();
      if (currentToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${currentToken}`;
      } else {
        // Если токена нет в памяти, пробуем загрузить из localStorage
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          accessToken = storedToken;
          (headers as Record<string, string>)['Authorization'] = `Bearer ${storedToken}`;
        }
      }
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
      credentials: 'include', // Always include cookies for refresh token
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    let response = await fetch(url, config);

    // Handle 401 - attempt token refresh
    if (response.status === 401 && !skipAuth) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        const newToken = await refreshAccessToken();
        
        isRefreshing = false;
        
        if (newToken) {
          onTokenRefreshed(newToken);
          
          // Retry original request with new token
          (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, { ...config, headers });
        } else {
          // Refresh failed, clear tokens but don't redirect immediately
          // Let the calling code handle the error
          tokenManager.clearTokens();
          throw new Error('Session expired');
        }
      } else {
        // Wait for token refresh to complete
        return new Promise((resolve, reject) => {
          subscribeToTokenRefresh(async (token) => {
            try {
              (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
              const retryResponse = await fetch(url, { ...config, headers });
              
              if (!retryResponse.ok) {
                throw new Error(`HTTP Error: ${retryResponse.status}`);
              }
              
              resolve(await retryResponse.json());
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    }

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch {
        error = { message: 'Request failed' };
      }
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    
    // Check if response is HTML (API not available)
    if (text.startsWith('<!doctype') || text.startsWith('<html')) {
      throw new Error('API endpoint not available');
    }
    
    return text ? JSON.parse(text) : ({} as T);
  },
};

// Convenience methods
export function httpGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  return http.request<T>(endpoint, { method: 'GET', params });
}

export function httpPost<T>(endpoint: string, body?: unknown): Promise<T> {
  return http.request<T>(endpoint, { method: 'POST', body });
}

export function httpPut<T>(endpoint: string, body?: unknown): Promise<T> {
  return http.request<T>(endpoint, { method: 'PUT', body });
}

export function httpPatch<T>(endpoint: string, body?: unknown): Promise<T> {
  return http.request<T>(endpoint, { method: 'PATCH', body });
}

export function httpDelete<T>(endpoint: string): Promise<T> {
  return http.request<T>(endpoint, { method: 'DELETE' });
}
