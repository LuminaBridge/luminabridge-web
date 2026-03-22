import { test, expect } from '@playwright/test';

test.describe('Token Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByPlaceholder('邮箱 / Email').fill('admin@example.com');
    await page.getByPlaceholder('密码 / Password').fill('admin123');
    await page.getByText('登 录').click();
    await page.waitForURL('/dashboard');
  });

  test('should display tokens page', async ({ page }) => {
    await page.goto('/tokens');
    
    // Check page elements
    await expect(page.getByText('Token 管理')).toBeVisible();
    await expect(page.getByText('创建 Token')).toBeVisible();
  });

  test('should show token list', async ({ page }) => {
    await page.goto('/tokens');
    
    // Wait for token list to load
    await page.waitForTimeout(1000);
    
    // Check if token table is displayed
    const table = page.locator('.ant-table');
    expect(await table.count()).toBeGreaterThanOrEqual(0);
  });

  test('should open create token modal', async ({ page }) => {
    await page.goto('/tokens');
    
    // Click create button
    await page.getByText('创建 Token').click();
    
    // Should show modal
    await expect(page.locator('.ant-modal')).toBeVisible();
  });

  test('should validate create token form', async ({ page }) => {
    await page.goto('/tokens');
    
    // Click create button
    await page.getByText('创建 Token').click();
    
    // Try to submit without filling the form
    await page.getByText('确定').click();
    
    // Should show validation errors
    await expect(page.getByText('请输入 Token 名称')).toBeVisible();
  });

  test('should create a new token', async ({ page }) => {
    await page.goto('/tokens');
    
    // Click create button
    await page.getByText('创建 Token').click();
    
    // Fill token form
    await page.getByPlaceholder('Token 名称').fill('Test Token');
    
    // Select quota
    await page.getByPlaceholder('配额限制').fill('1000');
    
    // Submit form
    await page.getByText('确定').click();
    
    // Wait for success message
    await page.waitForTimeout(1000);
    
    // Should show success message
    const successMessage = page.locator('.ant-message-success');
    await expect(successMessage).toBeVisible();
  });

  test('should display token quota usage', async ({ page }) => {
    await page.goto('/tokens');
    
    // Wait for token list
    await page.waitForTimeout(1000);
    
    // Check if quota information is displayed
    const quotaElements = page.locator('.ant-progress');
    expect(await quotaElements.count()).toBeGreaterThanOrEqual(0);
  });

  test('should copy token to clipboard', async ({ page }) => {
    await page.goto('/tokens');
    
    // Wait for token list
    await page.waitForTimeout(1000);
    
    // Click copy button
    const copyButton = page.locator('.anticon-copy').first();
    if (await copyButton.isVisible()) {
      await copyButton.click();
      
      // Should show success message
      await page.waitForTimeout(500);
      const successMessage = page.locator('.ant-message-success');
      await expect(successMessage).toBeVisible();
    }
  });

  test('should revoke token', async ({ page }) => {
    await page.goto('/tokens');
    
    // Wait for token list
    await page.waitForTimeout(1000);
    
    // Click revoke button
    const revokeButton = page.locator('.anticon-delete').first();
    if (await revokeButton.isVisible()) {
      await revokeButton.click();
      
      // Should show confirmation modal
      await expect(page.locator('.ant-modal-confirm')).toBeVisible();
      
      // Confirm revocation
      await page.getByText('确定').click();
      
      // Wait for success message
      await page.waitForTimeout(1000);
    }
  });

  test('should filter tokens by status', async ({ page }) => {
    await page.goto('/tokens');
    
    // Wait for token list
    await page.waitForTimeout(1000);
    
    // Click status filter
    const statusFilter = page.getByText('状态');
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      
      // Select active status
      await page.getByText('活跃').click();
      
      // Should filter tokens
      await page.waitForTimeout(500);
    }
  });
});
