import apiClient from './api';
import type { Stats, ApiResponse, Channel } from '@types';

export interface UsageStatsParams {
  start: string;
  end: string;
  group_by?: 'day' | 'week' | 'month';
}

export interface UsageStats {
  date: string;
  requests: number;
  tokens: number;
  revenue: number;
}

export interface ChannelStats {
  channel_id: string;
  channel_name: string;
  requests: number;
  tokens: number;
  success_rate: number;
  avg_latency_ms: number;
}

export interface ModelStats {
  model_name: string;
  requests: number;
  tokens: number;
  percentage: number;
}

/**
 * 获取实时统计
 */
export const getRealtimeStats = async (): Promise<Stats> => {
  const response = await apiClient.get<ApiResponse<Stats>>('/stats/realtime');
  return response.data.data;
};

/**
 * 获取用量统计
 */
export const getUsageStats = async (params: UsageStatsParams): Promise<UsageStats[]> => {
  const response = await apiClient.get<ApiResponse<UsageStats[]>>('/stats/usage', { params });
  return response.data.data;
};

/**
 * 获取渠道统计
 */
export const getChannelStats = async (params: UsageStatsParams): Promise<ChannelStats[]> => {
  const response = await apiClient.get<ApiResponse<ChannelStats[]>>('/stats/channels', { params });
  return response.data.data;
};

/**
 * 获取模型统计
 */
export const getModelStats = async (params: UsageStatsParams): Promise<ModelStats[]> => {
  const response = await apiClient.get<ApiResponse<ModelStats[]>>('/stats/models', { params });
  return response.data.data;
};

/**
 * 获取仪表盘统计概览
 */
export const getDashboardStats = async (): Promise<{
  total_requests: number;
  total_tokens: number;
  active_channels: number;
  today_revenue: number;
  request_trend: UsageStats[];
  channel_status: Array<{ id: string; name: string; status: string }>;
}> => {
  const response = await apiClient.get<ApiResponse<any>>('/stats/dashboard');
  return response.data.data;
};

export interface StatsReportParams {
  start_time: number;
  end_time: number;
  group_by?: string;
}

/**
 * 获取统计报告
 */
export const getStatsReport = async (params: StatsReportParams): Promise<{
  trend: Array<{
    date: string;
    total: number;
    success: number;
    failed: number;
    tokens: number;
  }>;
  details: Array<{
    id: string;
    name: string;
    requests: number;
    success: number;
    failed: number;
    tokens: number;
  }>;
}> => {
  const response = await apiClient.get<ApiResponse<any>>('/stats/report', { params });
  return response.data.data;
};
