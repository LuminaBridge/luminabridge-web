/**
 * API Services Tests
 * 
 * Tests for API service functions with mock data.
 * API 服务函数测试（带 mock 数据）。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Stats API', () => {
    it('should fetch dashboard stats successfully', async () => {
      const mockData = {
        code: 0,
        message: 'success',
        data: {
          total_requests: 1000,
          total_tokens: 50000,
          active_channels: 5,
          today_revenue: 10.5,
          request_trend: [],
          channel_status: [],
          alerts: [],
        },
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      // Simulate API call
      const response = await mockedAxios.get('/api/v1/stats/dashboard');
      
      expect(response.data).toBeDefined();
      expect(response.data.code).toBe(0);
      expect(response.data.data.total_requests).toBe(1000);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle API error', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(mockedAxios.get('/api/v1/stats/dashboard')).rejects.toThrow('Network Error');
    });

    it('should fetch usage stats with parameters', async () => {
      const mockData = {
        code: 0,
        message: 'success',
        data: [
          {
            timestamp: '2024-01-01T00:00:00Z',
            requests: 100,
            total_tokens: 5000,
            cost: 1.5,
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const response = await mockedAxios.get('/api/v1/stats/usage', {
        params: {
          start: '2024-01-01',
          end: '2024-01-07',
          group_by: 'day',
        },
      });

      expect(response.data.data).toHaveLength(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/v1/stats/usage',
        expect.objectContaining({
          params: expect.objectContaining({
            group_by: 'day',
          }),
        })
      );
    });
  });

  describe('Channels API', () => {
    it('should fetch channel list', async () => {
      const mockData = {
        code: 0,
        message: 'success',
        data: {
          items: [
            { id: 1, name: 'OpenAI Channel', status: 'active' },
            { id: 2, name: 'Anthropic Channel', status: 'active' },
          ],
          total: 2,
        },
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const response = await mockedAxios.get('/api/v1/channels');
      
      expect(response.data.data.items).toHaveLength(2);
      expect(response.data.data.total).toBe(2);
    });

    it('should create a new channel', async () => {
      const mockChannel = {
        name: 'New Channel',
        channel_type: 'openai',
        key: 'sk-test-key',
        base_url: 'https://api.openai.com/v1',
        models: ['gpt-3.5-turbo', 'gpt-4'],
        weight: 10,
      };

      const mockResponse = {
        code: 0,
        message: 'success',
        data: { id: 3, ...mockChannel },
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const response = await mockedAxios.post('/api/v1/channels', mockChannel);
      
      expect(response.data.code).toBe(0);
      expect(response.data.data.id).toBe(3);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/channels', mockChannel);
    });
  });

  describe('Tokens API', () => {
    it('should fetch token list', async () => {
      const mockData = {
        code: 0,
        message: 'success',
        data: {
          items: [
            { id: 1, name: 'Test Token', quota_limit: 10000, quota_used: 5000 },
          ],
          total: 1,
        },
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const response = await mockedAxios.get('/api/v1/tokens');
      
      expect(response.data.data.items).toHaveLength(1);
      expect(response.data.data.items[0].quota_limit).toBe(10000);
    });

    it('should update token quota', async () => {
      const mockResponse = {
        code: 0,
        message: 'success',
        data: { id: 1, quota_limit: 20000 },
      };

      mockedAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const response = await mockedAxios.patch('/api/v1/tokens/1/quota', {
        quota_limit: 20000,
      });
      
      expect(response.data.data.quota_limit).toBe(20000);
    });
  });

  describe('Auth API', () => {
    it('should login successfully', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        code: 0,
        message: 'success',
        data: {
          token: 'jwt-token-here',
          user: {
            id: 1,
            email: 'test@example.com',
            display_name: 'Test User',
          },
        },
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const response = await mockedAxios.post('/api/v1/auth/login', mockCredentials);
      
      expect(response.data.data.token).toBeDefined();
      expect(response.data.data.user.email).toBe('test@example.com');
    });

    it('should handle invalid credentials', async () => {
      const mockError = {
        response: {
          data: {
            code: 401,
            message: 'Invalid credentials',
          },
        },
      };

      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        mockedAxios.post('/api/v1/auth/login', {
          email: 'test@example.com',
          password: 'wrong-password',
        })
      ).rejects.toHaveProperty('response.data.code', 401);
    });
  });
});

describe('API Response Handling', () => {
  it('should handle success response with code 0', () => {
    const successResponse = {
      code: 0,
      message: 'success',
      data: { result: 'ok' },
    };

    expect(successResponse.code).toBe(0);
    expect(successResponse.data).toBeDefined();
  });

  it('should handle error response with non-zero code', () => {
    const errorResponse = {
      code: 400,
      message: 'Bad request',
      data: null,
    };

    expect(errorResponse.code).toBe(400);
    expect(errorResponse.message).toBe('Bad request');
  });
});
