import apiClient from './api';
import type { Token, ApiResponse, PaginatedResponse } from '@types';

export interface CreateTokenParams {
  name: string;
  quota: number;
  expired_time?: number;
  allowed_models?: string[];
}

export interface TokenListParams {
  page?: number;
  page_size?: number;
  status?: string;
}

/**
 * 获取令牌列表
 */
export const getTokens = async (params?: TokenListParams): Promise<PaginatedResponse<Token>> => {
  const response = await apiClient.get<PaginatedResponse<Token>>('/tokens', { params });
  return response.data;
};

/**
 * 获取令牌详情
 */
export const getToken = async (id: string): Promise<Token> => {
  const response = await apiClient.get<ApiResponse<Token>>(`/tokens/${id}`);
  return response.data.data;
};

/**
 * 创建令牌
 */
export const createToken = async (params: CreateTokenParams): Promise<Token> => {
  const response = await apiClient.post<ApiResponse<Token>>('/tokens', params);
  return response.data.data;
};

/**
 * 删除令牌
 */
export const deleteToken = async (id: string): Promise<void> => {
  await apiClient.delete(`/tokens/${id}`);
};

/**
 * 更新令牌额度
 */
export const updateTokenQuota = async (id: string, quota: number): Promise<Token> => {
  const response = await apiClient.patch<ApiResponse<Token>>(`/tokens/${id}/quota`, { quota });
  return response.data.data;
};

/**
 * 更新令牌
 */
export const updateToken = async (id: string, params: Partial<CreateTokenParams>): Promise<Token> => {
  const response = await apiClient.put<ApiResponse<Token>>(`/tokens/${id}`, params);
  return response.data.data;
};
