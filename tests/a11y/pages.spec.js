import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

/**
 * Page-Level Accessibility Tests
 * Tests WCAG 2.1 Level AA compliance for all pages
 */

test.describe('Page Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Login before testing protected pages
    await page.goto('/login');
    
    // Check if we need to login
    const emailInput = page.getByRole('textbox', { name: /email/i });
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /sign in|login/i }).click();
      await page.waitForURL(/dashboard|portal/i, { timeout: 15000 });
    }
  });

  test('Login page should be accessible', async ({ page }) => {
    await page.goto('/login');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('Executive Dashboard should be accessible', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
    });
  });

  test('Deal Management page should be accessible', async ({ page }) => {
    await page.goto('/deal-management');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page);
  });

  test('Partner Management page should be accessible', async ({ page }) => {
    await page.goto('/partner-management');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page);
  });

  test('Inventory Management page should be accessible', async ({ page }) => {
    await page.goto('/inventory-management');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page);
  });

  test('Compliance Tracking page should be accessible', async ({ page }) => {
    await page.goto('/compliance-tracking');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page);
  });

  test('Analytics page should be accessible', async ({ page }) => {
    await page.goto('/analytics-and-reporting');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page);
  });

  test('Partner Portal page should be accessible', async ({ page }) => {
    await page.goto('/partner-portal');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page);
  });

  test('Quote Generation page should be accessible', async ({ page }) => {
    await page.goto('/quote-generation');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    await checkA11y(page);
  });

  test('should have no color contrast violations', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    const violations = await getViolations(page, null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    
    expect(violations).toHaveLength(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    const violations = await getViolations(page, null, {
      rules: {
        'heading-order': { enabled: true }
      }
    });
    
    expect(violations).toHaveLength(0);
  });

  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    const violations = await getViolations(page, null, {
      rules: {
        'image-alt': { enabled: true }
      }
    });
    
    expect(violations).toHaveLength(0);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/deal-management');
    await page.waitForLoadState('networkidle');
    
    // Open add deal modal
    await page.click('button:has-text("Add Deal")');
    await page.waitForSelector('[role="dialog"]');
    
    await injectAxe(page);
    
    const violations = await getViolations(page, null, {
      rules: {
        'label': { enabled: true }
      }
    });
    
    expect(violations).toHaveLength(0);
  });

  test('should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await page.waitForLoadState('networkidle');
    await injectAxe(page);
    
    const violations = await getViolations(page, null, {
      rules: {
        'region': { enabled: true },
        'landmark-one-main': { enabled: true }
      }
    });
    
    expect(violations).toHaveLength(0);
  });
});
