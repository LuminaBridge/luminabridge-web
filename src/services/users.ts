import apiClient from './api';
import type { User, ApiResponse, PaginatedResponse } from '@types';

export interface CreateUserParams {
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'tenant_admin' | 'user';
}

export interface UpdateUserParams extends Partial<Omit<CreateUserParams, 'password'>> {
  password?: string;
}

export interface UserListParams {
  page?: number;
  page_size?: number;
  role?: string;
  search?: string;
}

export interface InviteUserParams {
  email: string;
  role: 'admin' | 'tenant_admin' | 'user';
}

/**
 * 获取用户列表
 */
export const getUsers = async (params?: UserListParams): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
  return response.data;
};

/**
 * 获取用户详情
 */
export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return response.data.data;
};

/**
 * 创建用户
 */
export const createUser = async (params: CreateUserParams): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>('/users', params);
  return response.data.data;
};

/**
 * 更新用户
 */
export const updateUser = async (id: string, params: UpdateUserParams): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, params);
  return response.data.data;
};

/**
 * 删除用户
 */
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

/**
 * 邀请用户
 */
export const inviteUser = async (params: InviteUserParams): Promise<{ invite_id: string; email: string }> => {
  const response = await apiClient.post<ApiResponse<{ invite_id: string; email: string }>>('/users/invite', params);
  return response.data.data;
};

/**
 * 获取当前用户
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/users/me');
  return response.data.data;
};
