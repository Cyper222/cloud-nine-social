// Auth API Types for backend integration

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  avatar?: string;
  created_at: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
