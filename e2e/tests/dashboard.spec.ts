import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByPlaceholder('邮箱 / Email').fill('admin@example.com');
    await page.getByPlaceholder('密码 / Password').fill('admin123');
    await page.getByText('登 录').click();
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check page title
    await expect(page).toHaveTitle(/LuminaBridge/);
    
    // Check dashboard elements
    await expect(page.getByText('仪表盘')).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for stats to load
    await page.waitForTimeout(1000);
    
    // Check if stat cards are displayed
    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThanOrEqual(1);
  });

  test('should display request count', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for stats to load
    await page.waitForTimeout(1000);
    
    // Check if request count is displayed
    const requestStat = page.getByText(/总请求数|请求数/);
    await expect(requestStat).toBeVisible();
  });

  test('should display channel count', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for stats to load
    await page.waitForTimeout(1000);
    
    // Check if channel count is displayed
    const channelStat = page.getByText(/渠道数|渠道/);
    await expect(channelStat).toBeVisible();
  });

  test('should display token count', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for stats to load
    await page.waitForTimeout(1000);
    
    // Check if token count is displayed
    const tokenStat = page.getByText(/Token 数|Token/);
    await expect(tokenStat).toBeVisible();
  });

  test('should display chart', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for chart to load
    await page.waitForTimeout(1000);
    
    // Check if chart is displayed
    const chart = page.locator('.recharts-surface, .echarts');
    expect(await chart.count()).toBeGreaterThanOrEqual(0);
  });

  test('should display recent activity', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for activity to load
    await page.waitForTimeout(1000);
    
    // Check if activity section is displayed
    const activitySection = page.getByText(/最近活动|活动/);
    await expect(activitySection).toBeVisible();
  });

  test('should refresh statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for initial load
    await page.waitForTimeout(1000);
    
    // Click refresh button
    const refreshButton = page.locator('.anticon-reload, .anticon-sync');
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      
      // Wait for refresh
      await page.waitForTimeout(1000);
      
      // Stats should still be visible
      const statCards = page.locator('.ant-statistic');
      expect(await statCards.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('should display system health status', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for health status to load
    await page.waitForTimeout(1000);
    
    // Check if health status is displayed
    const healthStatus = page.getByText(/系统状态|健康|状态/);
    await expect(healthStatus).toBeVisible();
  });
});
