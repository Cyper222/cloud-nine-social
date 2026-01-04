// HTTP Client with automatic token refresh and retry logic

const API_BASE = import.meta.env.VITE_API_URL || '/api';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Token management
export const tokenManager = {
  getAccessToken: () => accessToken,
  
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  
  clearTokens: () => {
    accessToken = null;
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
    
    if (newToken) {
      tokenManager.setAccessToken(newToken);
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
    if (!skipAuth && accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
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
          // Refresh failed, redirect to login
          window.location.href = '/auth/login';
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
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
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
