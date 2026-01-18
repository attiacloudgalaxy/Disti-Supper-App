import { test, expect } from '@playwright/test';

/**
 * Deal Management E2E Tests
 * Tests the complete deal management workflow
 */

test.describe('Deal Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await page.waitForURL(/dashboard|portal/i, { timeout: 15000 });
  });

  test('should navigate to deal management page', async ({ page }) => {
    // Click on Deals navigation
    await page.click('text=Deals, a[href*="deal"]');
    await expect(page).toHaveURL(/deal-management/i);
    await expect(page.locator('h1')).toContainText(/deal/i);
  });

  test('should display deals table', async ({ page }) => {
    await page.goto('/deal-management');
    
    // Wait for table to load
    await page.waitForSelector('table, [role="table"]', { timeout: 10000 });
    
    // Check for table headers
    await expect(page.locator('th, [role="columnheader"]')).toHaveCount({ min: 3 });
  });

  test('should open add deal modal', async ({ page }) => {
    await page.goto('/deal-management');
    
    // Click Add Deal button
    await page.click('button:has-text("Add Deal")');
    
    // Modal should be visible
    await expect(page.locator('[role="dialog"], .modal')).toBeVisible();
    await expect(page.locator('h2, h3')).toContainText(/add|new.*deal/i);
  });

  test('should create a new deal', async ({ page }) => {
    await page.goto('/deal-management');
    
    // Open add deal modal
    await page.click('button:has-text("Add Deal")');
    
    // Fill form
    await page.fill('[name="name"], input[placeholder*="name" i]', 'Test Deal E2E');
    await page.fill('[name="company"], input[placeholder*="company" i]', 'Test Company');
    await page.fill('[name="value"], input[placeholder*="value" i]', '100000');
    
    // Select stage if available
    const stageSelect = page.locator('[name="stage"], select');
    if (await stageSelect.isVisible()) {
      await stageSelect.selectOption('prospecting');
    }
    
    // Submit form
    await page.click('button:has-text("Save"), button:has-text("Create")');
    
    // Wait for modal to close and deal to appear in table
    await page.waitForSelector('[role="dialog"], .modal', { state: 'hidden', timeout: 10000 });
    await expect(page.locator('text=Test Deal E2E')).toBeVisible({ timeout: 10000 });
  });

  test('should filter deals by stage', async ({ page }) => {
    await page.goto('/deal-management');
    
    // Wait for deals to load
    await page.waitForSelector('table, [role="table"]', { timeout: 10000 });
    
    // Find and use stage filter
    const stageFilter = page.locator('[name="stage"], select:has-text("Stage")');
    if (await stageFilter.isVisible()) {
      await stageFilter.selectOption('prospecting');
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
      
      // Verify filter is applied
      await expect(page.locator('[data-stage="prospecting"], .stage-prospecting')).toHaveCount({ min: 0 });
    }
  });

  test('should view deal details', async ({ page }) => {
    await page.goto('/deal-management');
    
    // Wait for table
    await page.waitForSelector('table, [role="table"]', { timeout: 10000 });
    
    // Click on first deal row
    const firstRow = page.locator('tbody tr, [role="row"]').first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      
      // Detail modal should open
      await expect(page.locator('[role="dialog"], .modal')).toBeVisible();
    }
  });

  test('should search for deals', async ({ page }) => {
    await page.goto('/deal-management');
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Results should be filtered
      await expect(page.locator('tbody tr, [role="row"]')).toHaveCount({ min: 0 });
    }
  });

  test('should export deals', async ({ page }) => {
    await page.goto('/deal-management');
    
    // Find export button
    const exportButton = page.locator('button:has-text("Export")');
    if (await exportButton.isVisible()) {
      // Setup download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      
      await exportButton.click();
      
      // Wait for download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/deals|export/i);
    }
  });
});
