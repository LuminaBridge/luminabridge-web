// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'tenant_admin' | 'user';
  tenant_id?: string;
  created_at: number;
}

// 租户类型
export interface Tenant {
  id: string;
  name: string;
  admin_email: string;
  user_count: number;
  channel_count: number;
  monthly_usage: number;
  status: 'active' | 'suspended' | 'over_limit';
  settings: TenantSettings;
}

export interface TenantSettings {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  timezone: string;
}

// 渠道类型
export interface Channel {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  base_url: string;
  models: string[];
  weight: number;
  request_count?: number;
  error_rate?: number;
  latency_ms?: number;
  created_at: number;
  updated_at: number;
}

// 令牌类型
export interface Token {
  id: string;
  name: string;
  token: string;
  quota: number;
  used_quota: number;
  expired_time?: number;
  allowed_models: string[];
  status: 'active' | 'inactive';
  created_at: number;
}

// 统计类型
export interface Stats {
  tps: number;
  rpm: number;
  latency_ms: number;
  error_rate: number;
  total_requests: number;
  total_tokens: number;
  active_channels: number;
  today_revenue: number;
}

// 告警类型
export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  created_at: number;
  acknowledged: boolean;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页类型
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// WebSocket 消息类型
export interface WebSocketMessage {
  type: 'stats' | 'channel_status' | 'alert';
  data: any;
}
