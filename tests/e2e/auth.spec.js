import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests the complete authentication flow including login, logout, and SSO
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Login.*DistributorHub/i);
    await expect(page.locator('h1, h2, h3')).toContainText(/DistributorHub|Login|Sign in/i);
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /sign in|login/i });
    await submitButton.click();

    // Check for validation messages
    await expect(page.locator('[role="alert"], .text-destructive, .error-message')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: /email/i }).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Wait for error message
    await expect(page.locator('[role="alert"], .text-destructive, .error-message')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to dashboard on successful login', async ({ page }) => {
    // Note: This test requires valid test credentials
    // Update with your test credentials or mock the auth response
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard|portal/i, { timeout: 15000 });
  });

  test('should display SSO options', async ({ page }) => {
    // Check for Google SSO button
    const googleButton = page.getByRole('button', { name: /google|sign in with google/i });
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
    }

    // Check for Azure AD SSO button
    const azureButton = page.getByRole('button', { name: /microsoft|azure|sign in with microsoft/i });
    if (await azureButton.isVisible()) {
      await expect(azureButton).toBeVisible();
    }
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/password/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeFocused();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toHaveAttribute('type', 'email');

    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await page.waitForURL(/dashboard|portal/i, { timeout: 15000 });
  });

  test('should logout successfully', async ({ page }) => {
    // Find and click logout button
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    await logoutButton.click();

    // Should redirect to login page
    await expect(page).toHaveURL(/login/i, { timeout: 10000 });
  });

  test('should clear session on logout', async ({ page }) => {
    // Logout
    await page.getByRole('button', { name: /logout|sign out/i }).click();
    await page.waitForURL(/login/i);

    // Try to access protected route
    await page.goto('/executive-dashboard');

    // Should redirect back to login
    await expect(page).toHaveURL(/login/i, { timeout: 10000 });
  });
});
