import apiClient from './api';
import type { Channel, ApiResponse, PaginatedResponse } from '@types';

export interface CreateChannelParams {
  name: string;
  type: string;
  key: string;
  base_url: string;
  models: string[];
  weight?: number;
}

export interface UpdateChannelParams extends Partial<CreateChannelParams> {
  status?: 'active' | 'inactive' | 'error';
}

export interface ChannelListParams {
  page?: number;
  page_size?: number;
  group?: string;
  status?: string;
  search?: string;
}

/**
 * 获取渠道列表
 */
export const getChannels = async (params?: ChannelListParams): Promise<PaginatedResponse<Channel>> => {
  const response = await apiClient.get<PaginatedResponse<Channel>>('/channels', { params });
  return response.data;
};

/**
 * 获取渠道详情
 */
export const getChannel = async (id: string): Promise<Channel> => {
  const response = await apiClient.get<ApiResponse<Channel>>(`/channels/${id}`);
  return response.data.data;
};

/**
 * 创建渠道
 */
export const createChannel = async (params: CreateChannelParams): Promise<Channel> => {
  const response = await apiClient.post<ApiResponse<Channel>>('/channels', params);
  return response.data.data;
};

/**
 * 更新渠道
 */
export const updateChannel = async (id: string, params: UpdateChannelParams): Promise<Channel> => {
  const response = await apiClient.put<ApiResponse<Channel>>(`/channels/${id}`, params);
  return response.data.data;
};

/**
 * 删除渠道
 */
export const deleteChannel = async (id: string): Promise<void> => {
  await apiClient.delete(`/channels/${id}`);
};

/**
 * 测试渠道
 */
export const testChannel = async (id: string): Promise<{ success: boolean; message: string; latency_ms?: number }> => {
  const response = await apiClient.post<ApiResponse<{ success: boolean; message: string; latency_ms?: number }>>(
    `/channels/${id}/test`
  );
  return response.data.data;
};

/**
 * 批量操作渠道
 */
export const batchOperateChannels = async (
  action: 'enable' | 'disable' | 'delete',
  ids: string[]
): Promise<void> => {
  await apiClient.post('/channels/batch', { action, ids });
};
