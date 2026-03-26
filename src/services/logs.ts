import apiClient from './api';
import type { ApiResponse } from '@types';

export interface OperationLog {
  id: string;
  timestamp: number;
  level: string;
  module: string;
  action: string;
  user: string;
  ip: string;
  message: string;
}

export interface LogsQueryParams {
  search?: string;
  level?: string;
  module?: string;
  start_time?: number;
  end_time?: number;
  page?: number;
  page_size?: number;
}

/**
 * 获取操作日志列表
 */
export const getOperationLogs = async (params?: LogsQueryParams): Promise<{
  data: OperationLog[];
  total: number;
  page: number;
  page_size: number;
}> => {
  const response = await apiClient.get<ApiResponse<any>>('/logs/operations', { params });
  return response.data.data;
};

/**
 * 获取日志级别统计
 */
export const getLogLevelStats = async (params?: LogsQueryParams): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/logs/level-stats', { params });
  return response.data.data;
};

/**
 * 获取日志模块统计
 */
export const getLogModuleStats = async (params?: LogsQueryParams): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/logs/module-stats', { params });
  return response.data.data;
};

/**
 * 导出日志
 */
export const exportLogs = async (params?: LogsQueryParams): Promise<Blob> => {
  const response = await apiClient.get('/logs/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
};
