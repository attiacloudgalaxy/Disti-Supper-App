# Implementation Guide: Setting Up New Repository with Enhanced Testing & CI/CD

This guide provides step-by-step instructions to implement the testing and CI/CD enhancements in a new GitHub repository.

---

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub account with repository creation permissions
- [ ] Git installed locally
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] GitHub CLI (optional but recommended): `gh` command

---

## Step 1: Create New GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name**: `distributorhub-enhanced` (or your preferred name)
   - **Description**: "DistributorHub with comprehensive testing and CI/CD"
   - **Visibility**: Private or Public (your choice)
   - **Initialize**: ✅ Add README, ❌ .gitignore (we'll copy existing), ❌ License
3. Click "Create repository"

### Option B: Using GitHub CLI

```bash
# Create new repository
gh repo create distributorhub-enhanced --public --description "DistributorHub with comprehensive testing and CI/CD"

# Or for private repository
gh repo create distributorhub-enhanced --private --description "DistributorHub with comprehensive testing and CI/CD"
```

---

## Step 2: Clone and Setup Local Repository

```bash
# Clone the new repository
git clone https://github.com/YOUR_USERNAME/distributorhub-enhanced.git
cd distributorhub-enhanced

# Copy all files from current project (excluding .git)
cp -r /Users/moe_aboelnil/Downloads/distributorhub/* .
cp -r /Users/moe_aboelnil/Downloads/distributorhub/.* . 2>/dev/null || true

# Remove old .git directory (if copied)
rm -rf .git

# Initialize new git repository
git init
git add .
git commit -m "Initial commit: Base DistributorHub project"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/distributorhub-enhanced.git
git branch -M main
git push -u origin main
```

---

## Step 3: Install Additional Dependencies

```bash
# Install Playwright for E2E testing
npm install -D @playwright/test

# Install Playwright browsers
npx playwright install

# Install additional testing tools
npm install -D @axe-core/playwright
npm install -D size-limit @size-limit/file
npm install -D eslint-plugin-security

# Install monitoring tools
npm install @sentry/react @sentry/tracing
npm install web-vitals

# Install optional tools
npm install -D percy-cli  # For visual regression (requires Percy account)
```

---

## Step 4: Update package.json Scripts

Add the following scripts to [`package.json`](package.json:1):

```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build --sourcemap",
    "serve": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.js",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:a11y": "playwright test tests/a11y",
    "test:visual": "percy exec -- playwright test tests/visual",
    "test:performance": "k6 run tests/performance/load-test.js",
    "lint": "eslint src --ext .js,.jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "lint:security": "eslint src --ext .js,.jsx --plugin security",
    "type-check": "tsc --noEmit",
    "size": "size-limit",
    "analyze": "vite-bundle-visualizer"
  }
}
```

---

## Step 5: Create Enhanced GitHub Actions Workflows

### 5.1 Create Main CI/CD Workflow

Create `.github/workflows/ci.yml`:

```bash
mkdir -p .github/workflows
```

Copy the enhanced CI workflow from [`TESTING_AND_CI_ENHANCEMENT_PLAN.md`](TESTING_AND_CI_ENHANCEMENT_PLAN.md:1) Section "Enhanced CI/CD Workflows" → "1. Enhanced Main Workflow"

### 5.2 Create PR Preview Workflow

Create `.github/workflows/pr-preview.yml`:

Copy the enhanced PR preview workflow from the planning document.

### 5.3 Create Performance Monitoring Workflow

Create `.github/workflows/performance.yml`:

Copy the performance monitoring workflow from the planning document.

### 5.4 Create Security Scanning Workflow

Create `.github/workflows/security-scan.yml`:

Copy the security scanning workflow from the planning document.

---

## Step 6: Setup GitHub Secrets

Go to your repository settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Required Secrets

```
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_URL_STAGING=your-staging-supabase-url
VITE_SUPABASE_ANON_KEY_STAGING=your-staging-supabase-anon-key

# Azure AD
VITE_AZURE_CLIENT_ID=your-azure-client-id
VITE_AZURE_TENANT_ID=your-azure-tenant-id

# Email
VITE_EMAIL_SENDER=noreply@yourdomain.com
```

### Optional Secrets (for enhanced features)

```
# Netlify (for PR previews)
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-netlify-site-id

# Snyk (for dependency scanning)
SNYK_TOKEN=your-snyk-token

# Percy (for visual regression)
PERCY_TOKEN=your-percy-token

# Sentry (for error tracking)
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# GitGuardian (for secrets scanning)
GITGUARDIAN_API_KEY=your-gitguardian-key
```

---

## Step 7: Create Test Directory Structure

```bash
# Create test directories
mkdir -p tests/{unit,integration,e2e,a11y,visual,performance,security}

# Create subdirectories
mkdir -p tests/unit/{components,services,utils}
mkdir -p tests/unit/components/{ui,navigation}
```

---

## Step 8: Create Playwright Configuration

Create `playwright.config.js`:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:4028',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4028',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Step 9: Create Integration Test Configuration

Create `vitest.integration.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['tests/integration/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.{js,jsx}'],
    },
  },
});
```

---

## Step 10: Create Example Tests

### 10.1 Example E2E Test

Create `tests/e2e/auth.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/executive-dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});
```

### 10.2 Example Integration Test

Create `tests/integration/deal-management.test.jsx`:

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import DealManagement from '../../src/pages/deal-management';

describe('Deal Management Integration', () => {
  it('should create a deal and update the list', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <DealManagement />
        </AuthProvider>
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button', { name: /add deal/i }));
    await user.type(screen.getByLabelText(/deal name/i), 'New Deal');
    await user.type(screen.getByLabelText(/company/i), 'Acme Corp');
    await user.type(screen.getByLabelText(/value/i), '100000');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText('New Deal')).toBeInTheDocument();
    });
  });
});
```

### 10.3 Example Accessibility Test

Create `tests/a11y/pages.spec.js`:

```javascript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Page Accessibility', () => {
  test('Executive Dashboard is accessible', async ({ page }) => {
    await page.goto('/executive-dashboard');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('Deal Management is accessible', async ({ page }) => {
    await page.goto('/deal-management');
    await injectAxe(page);
    await checkA11y(page);
  });
});
```

---

## Step 11: Setup Size Limit

Create `.size-limit.json`:

```json
[
  {
    "name": "Main Bundle",
    "path": "build/assets/*.js",
    "limit": "500 KB"
  },
  {
    "name": "CSS Bundle",
    "path": "build/assets/*.css",
    "limit": "50 KB"
  }
]
```

---

## Step 12: Enhanced Lighthouse Configuration

Update `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./build",
      "url": [
        "/",
        "/login",
        "/executive-dashboard",
        "/deal-management",
        "/partner-management",
        "/inventory-management",
        "/compliance-tracking",
        "/analytics-and-reporting"
      ],
      "numberOfRuns": 5
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }],
        "categories:seo": ["warn", { "minScore": 0.85 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 4000 }],
        "total-blocking-time": ["error", { "maxNumericValue": 600 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.25 }],
        "speed-index": ["warn", { "maxNumericValue": 4000 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## Step 13: Create Load Test Script

Create `tests/performance/load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 500 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://your-app.com/api/deals');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

---

## Step 14: Setup ESLint Security Plugin

Update `.eslintrc.js`:

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:security/recommended',  // Add this
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: ['react-refresh', 'security'],  // Add 'security'
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
    'no-var': 'error',
    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
  },
  ignorePatterns: [
    'dist',
    'build',
    'node_modules',
    '.eslintrc.js',
    'vite.config.mjs',
    'tailwind.config.js',
    'postcss.config.js',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/*.spec.js',
    '**/*.spec.jsx',
  ],
};
```

---

## Step 15: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `build` (or configure GitHub Actions deployment)
4. Save

---

## Step 16: Setup Branch Protection Rules

1. Go to repository Settings → Branches
2. Add branch protection rule for `main`:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass before merging
   - Select required checks:
     - Lint
     - Type Check
     - Security (SAST)
     - Unit Tests
     - Integration Tests
     - E2E Tests
     - Accessibility Tests
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

---

## Step 17: Commit and Push Changes

```bash
# Add all new files
git add .

# Commit changes
git commit -m "feat: Add comprehensive testing and CI/CD enhancements

- Add Playwright for E2E testing
- Add integration test configuration
- Add accessibility testing
- Add performance testing with k6
- Add enhanced GitHub Actions workflows
- Add security scanning (Semgrep, Snyk, TruffleHog)
- Add bundle size monitoring
- Add PR preview deployments
- Update Lighthouse configuration
- Add ESLint security plugin
- Add comprehensive test examples"

# Push to GitHub
git push origin main
```

---

## Step 18: Verify GitHub Actions

1. Go to your repository on GitHub
2. Click "Actions" tab
3. You should see workflows running
4. Check that all jobs complete successfully

---

## Step 19: Create First Pull Request

```bash
# Create a new branch
git checkout -b feature/test-pr-workflow

# Make a small change
echo "# Test PR Workflow" >> TEST.md
git add TEST.md
git commit -m "test: Verify PR workflow"

# Push branch
git push origin feature/test-pr-workflow

# Create PR using GitHub CLI
gh pr create --title "Test PR Workflow" --body "Testing the new CI/CD pipeline"

# Or create PR via GitHub web interface
```

Verify that:
- [ ] All CI checks run
- [ ] PR preview is deployed (if Netlify configured)
- [ ] Visual regression tests run (if Percy configured)
- [ ] All quality gates pass

---

## Step 20: Setup Monitoring (Optional)

### Sentry for Error Tracking

1. Sign up at https://sentry.io
2. Create new project
3. Get DSN
4. Add to GitHub Secrets: `SENTRY_DSN`
5. Update `src/index.jsx`:

```javascript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### Web Vitals Tracking

Update `src/index.jsx`:

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## Troubleshooting

### Issue: GitHub Actions failing

**Solution**: Check the Actions tab for detailed error messages. Common issues:
- Missing secrets
- Incorrect workflow syntax
- Node version mismatch

### Issue: Playwright tests failing

**Solution**:
```bash
# Install browsers
npx playwright install

# Run tests with UI mode for debugging
npm run test:e2e:ui
```

### Issue: Bundle size exceeding limit

**Solution**:
```bash
# Analyze bundle
npm run analyze

# Check what's taking up space
npx vite-bundle-visualizer
```

### Issue: Coverage below threshold

**Solution**:
```bash
# Run coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html

# Write tests for uncovered code
```

---

## Next Steps

1. **Week 1-2**: Write unit tests for all services
2. **Week 3-4**: Write integration tests
3. **Week 5-6**: Write E2E tests for critical paths
4. **Week 7-8**: Setup monitoring and alerts
5. **Week 9+**: Follow the 32-week implementation roadmap in [`TESTING_AND_CI_ENHANCEMENT_PLAN.md`](TESTING_AND_CI_ENHANCEMENT_PLAN.md:1)

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [k6 Documentation](https://k6.io/docs/)
- [Semgrep Documentation](https://semgrep.dev/docs/)
- [Snyk Documentation](https://docs.snyk.io/)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the planning document for detailed explanations
3. Consult the official documentation for each tool
4. Open an issue in the repository

---

**Last Updated**: January 18, 2026  
**Version**: 1.0
