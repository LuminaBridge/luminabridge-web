import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check page title
    await expect(page).toHaveTitle(/LuminaBridge/);
    
    // Check login form elements
    await expect(page.getByPlaceholder('邮箱 / Email')).toBeVisible();
    await expect(page.getByPlaceholder('密码 / Password')).toBeVisible();
    await expect(page.getByText('登 录')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without filling the form
    await page.getByText('登 录').click();
    
    // Should show validation errors
    await expect(page.getByText('请输入邮箱')).toBeVisible();
    await expect(page.getByText('请输入密码')).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/login');
    
    // Fill invalid email
    await page.getByPlaceholder('邮箱 / Email').fill('invalid-email');
    await page.getByPlaceholder('密码 / Password').fill('password123');
    
    // Submit form
    await page.getByText('登 录').click();
    
    // Should show email validation error
    await expect(page.getByText('请输入有效的邮箱地址')).toBeVisible();
  });

  test('should show error message for failed login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill credentials
    await page.getByPlaceholder('邮箱 / Email').fill('wrong@example.com');
    await page.getByPlaceholder('密码 / Password').fill('wrongpassword');
    
    // Submit form
    await page.getByText('登 录').click();
    
    // Wait for error message
    await page.waitForTimeout(1000);
    
    // Should show error (exact message depends on backend response)
    const errorMessage = page.locator('.ant-message-error');
    await expect(errorMessage).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    // Click register link
    await page.getByText('立即注册').click();
    
    // Should navigate to register page
    await expect(page).toHaveURL('/register');
  });

  test('should show OAuth login buttons', async ({ page }) => {
    await page.goto('/login');
    
    // Check OAuth buttons
    await expect(page.getByText('GitHub')).toBeVisible();
    await expect(page.getByText('Discord')).toBeVisible();
  });
});
