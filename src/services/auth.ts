import apiClient from './api';
import type { User, ApiResponse } from '@types';

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refresh_token: string;
}

/**
 * 用户登录
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', params);
  return response.data.data;
};

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * OAuth 登录
 */
export const oauthLogin = (provider: 'github' | 'discord' | 'google'): string => {
  return `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/oauth/${provider}`;
};

/**
 * 刷新 Token
 */
export const refreshToken = async (refreshToken: string): Promise<{ token: string; refresh_token: string }> => {
  const response = await apiClient.post<ApiResponse<{ token: string; refresh_token: string }>>('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data.data;
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};
