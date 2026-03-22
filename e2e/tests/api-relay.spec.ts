import { test, expect } from '@playwright/test';

test.describe('API Relay', () => {
  test('should handle chat completions request', async ({ request }) => {
    // This test requires a valid API token
    const token = process.env.TEST_API_TOKEN || 'sk-test-token';
    
    const response = await request.post('http://localhost:3000/v1/chat/completions', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
      },
    });
    
    // Should return either success or proper error
    expect([200, 401, 403]).toContain(response.status());
  });

  test('should reject request without authorization', async ({ request }) => {
    const response = await request.post('http://localhost:3000/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
      },
    });
    
    // Should return 401 Unauthorized
    expect(response.status()).toBe(401);
  });

  test('should reject request with invalid token', async ({ request }) => {
    const response = await request.post('http://localhost:3000/v1/chat/completions', {
      headers: {
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
      },
    });
    
    // Should return 401 or 403
    expect([401, 403]).toContain(response.status());
  });

  test('should handle models list request', async ({ request }) => {
    const token = process.env.TEST_API_TOKEN || 'sk-test-token';
    
    const response = await request.get('http://localhost:3000/v1/models', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // Should return either success or proper error
    expect([200, 401, 403]).toContain(response.status());
  });

  test('should handle health check endpoint', async ({ request }) => {
    const response = await request.get('http://localhost:3000/health');
    
    // Should return 200 OK
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('status');
  });
});
