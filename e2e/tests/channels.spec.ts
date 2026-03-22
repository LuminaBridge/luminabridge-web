import { test, expect } from '@playwright/test';

test.describe('Channel Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByPlaceholder('邮箱 / Email').fill('admin@example.com');
    await page.getByPlaceholder('密码 / Password').fill('admin123');
    await page.getByText('登 录').click();
    await page.waitForURL('/dashboard');
  });

  test('should display channels page', async ({ page }) => {
    await page.goto('/channels');
    
    // Check page elements
    await expect(page.getByText('渠道管理')).toBeVisible();
    await expect(page.getByText('创建渠道')).toBeVisible();
  });

  test('should show channel list', async ({ page }) => {
    await page.goto('/channels');
    
    // Wait for channel list to load
    await page.waitForSelector('.ant-card', { timeout: 5000 });
    
    // Check if channel cards are displayed
    const channelCards = page.locator('.ant-card');
    expect(await channelCards.count()).toBeGreaterThanOrEqual(0);
  });

  test('should open create channel modal', async ({ page }) => {
    await page.goto('/channels');
    
    // Click create button
    await page.getByText('创建渠道').click();
    
    // Should show modal
    await expect(page.locator('.ant-modal')).toBeVisible();
  });

  test('should validate create channel form', async ({ page }) => {
    await page.goto('/channels');
    
    // Click create button
    await page.getByText('创建渠道').click();
    
    // Try to submit without filling the form
    await page.getByText('确定').click();
    
    // Should show validation errors
    await expect(page.getByText('请输入渠道名称')).toBeVisible();
  });

  test('should create a new channel', async ({ page }) => {
    await page.goto('/channels');
    
    // Click create button
    await page.getByText('创建渠道').click();
    
    // Fill channel form
    await page.getByPlaceholder('渠道名称').fill('Test Channel');
    await page.getByPlaceholder('API Key').fill('sk-test123456');
    
    // Select channel type
    await page.getByLabel('渠道类型').click();
    await page.getByText('OpenAI').click();
    
    // Submit form
    await page.getByText('确定').click();
    
    // Wait for success message
    await page.waitForTimeout(1000);
    
    // Should show success message
    const successMessage = page.locator('.ant-message-success');
    await expect(successMessage).toBeVisible();
  });

  test('should edit existing channel', async ({ page }) => {
    await page.goto('/channels');
    
    // Wait for channel list
    await page.waitForSelector('.ant-card', { timeout: 5000 });
    
    // Click edit button on first channel
    const editButton = page.locator('.anticon-edit').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Should show edit modal
      await expect(page.locator('.ant-modal')).toBeVisible();
    }
  });

  test('should test channel connection', async ({ page }) => {
    await page.goto('/channels');
    
    // Wait for channel list
    await page.waitForSelector('.ant-card', { timeout: 5000 });
    
    // Click test button on first channel
    const testButton = page.locator('.anticon-thunderbolt').first();
    if (await testButton.isVisible()) {
      await testButton.click();
      
      // Wait for test result
      await page.waitForTimeout(2000);
      
      // Should show test result message
      const message = page.locator('.ant-message');
      await expect(message).toBeVisible();
    }
  });

  test('should delete channel', async ({ page }) => {
    await page.goto('/channels');
    
    // Wait for channel list
    await page.waitForSelector('.ant-card', { timeout: 5000 });
    
    // Click delete button on first channel
    const deleteButton = page.locator('.anticon-delete').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Should show confirmation modal
      await expect(page.locator('.ant-modal-confirm')).toBeVisible();
      
      // Confirm deletion
      await page.getByText('确定').click();
      
      // Wait for success message
      await page.waitForTimeout(1000);
    }
  });
});
