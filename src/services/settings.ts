import apiClient from './api';
import type { ApiResponse } from '@types';

export interface SystemSettings {
  app_name: string;
  app_version: string;
  company_name: string;
  contact_email: string;
  timezone: string;
  language: string;
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number;
  require_strong_password: boolean;
  enable_2fa: boolean;
  password_min_length: number;
  api_rate_limit: number;
  api_timeout: number;
  enable_api_logging: boolean;
  enable_cors: boolean;
  allowed_origins: string;
}

/**
 * 获取系统设置
 */
export const getSystemSettings = async (): Promise<SystemSettings> => {
  const response = await apiClient.get<ApiResponse<SystemSettings>>('/settings/system');
  return response.data.data;
};

/**
 * 更新系统设置
 */
export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
  const response = await apiClient.put<ApiResponse<SystemSettings>>('/settings/system', settings);
  return response.data.data;
};

/**
 * 获取系统信息
 */
export const getSystemInfo = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/settings/info');
  return response.data.data;
};

/**
 * 重置系统设置为默认值
 */
export const resetSystemSettings = async (): Promise<SystemSettings> => {
  const response = await apiClient.post<ApiResponse<SystemSettings>>('/settings/reset');
  return response.data.data;
};
