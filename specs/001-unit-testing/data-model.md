# Data Model: Unit Testing Infrastructure

**Feature Branch**: `001-unit-testing`
**Date**: 2025-01-17

## Overview

This document defines the key entities and their relationships for the unit testing infrastructure. Since this is a testing infrastructure feature, the "data model" represents configuration structures rather than database entities.

---

## Entity: Test Configuration

**Purpose**: Central configuration for test runner behavior

**Location**: `vitest.config.js` (root)

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| test.globals | boolean | Enable global test APIs (describe, it, expect) |
| test.environment | string | DOM environment: "jsdom" |
| test.setupFiles | string[] | Setup files to run before tests |
| test.include | string[] | Glob patterns for test files |
| test.coverage.provider | string | Coverage provider: "v8" |
| test.coverage.reporter | string[] | Output formats: text, html, json |
| test.coverage.thresholds | object | Minimum coverage requirements |

**Relationships**:

- References -> Setup Files
- Produces -> Coverage Report

---

## Entity: Setup Files

**Purpose**: Test environment configuration and global utilities

**Location**: `vitest.setup.js` (root)

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| matchers | extension | jest-dom matchers for DOM assertions |
| axeMatchers | extension | vitest-axe matchers for a11y |
| mswServer | import | MSW server for API mocking |
| cleanup | function | Automatic cleanup after each test |

**Relationships**:

- Imports -> MSW Server
- Extends -> Expect matchers

---

## Entity: MSW Handlers

**Purpose**: API mock definitions for network request interception

**Location**: `src/__mocks__/handlers.js`

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| handlers | array | REST handler definitions |
| baseUrl | string | Supabase API base URL to intercept |

**Handler Structure**:

```javascript
http.get('/rest/v1/resource', ({ request }) => {
  return HttpResponse.json({ data: [...] })
})

http.post('/rest/v1/resource', async ({ request }) => {
  const body = await request.json()
  return HttpResponse.json({ data: body }, { status: 201 })
})
```

**Relationships**:

- Used by -> MSW Server (Node.js)
- Organized by -> Service domain (auth, deals, partners)

---

## Entity: MSW Server

**Purpose**: Node.js server for intercepting network requests in tests

**Location**: `src/__mocks__/server.js`

**Configuration**:

```javascript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

**Lifecycle**:

| Phase | Method | Purpose |
|-------|--------|---------|
| beforeAll | server.listen() | Start intercepting |
| afterEach | server.resetHandlers() | Reset to default handlers |
| afterAll | server.close() | Stop intercepting |

---

## Entity: Test Utilities

**Purpose**: Shared testing helpers and custom render functions

**Location**: `src/test-utils/`

**Files**:

| File | Purpose |
|------|---------|
| render.jsx | Custom render with providers |
| mocks.js | Common mock data factories |

**Custom Render Structure**:

```javascript
function renderWithProviders(ui, {
  preloadedState = {},
  store = configureStore({ reducer: rootReducer, preloadedState }),
  ...renderOptions
} = {}) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
```

**Relationships**:

- Wraps -> Redux Provider
- Wraps -> React Router
- Returns -> Store instance for assertions

---

## Entity: Coverage Report

**Purpose**: Test coverage metrics and visualization

**Location**: `coverage/` (generated)

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| lines | percentage | Line coverage |
| branches | percentage | Branch coverage |
| functions | percentage | Function coverage |
| statements | percentage | Statement coverage |

**Output Formats**:

- `coverage/index.html` - Interactive HTML report
- `coverage/coverage-final.json` - JSON for CI integration
- Terminal summary - Quick feedback

**Thresholds** (per Constitution):

| Category | Minimum |
|----------|---------|
| Components | 80% |
| Services | 90% |
| Utils | 95% |
| Overall | 80% |

---

## Entity: Test File

**Purpose**: Individual test suite for a component or service

**Naming Convention**: `*.test.jsx` or `*.test.js`

**Structure**:

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'test-utils/render'

describe('ComponentName', () => {
  beforeEach(() => { /* setup */ })
  afterEach(() => { /* cleanup */ })

  it('should render correctly', () => { /* test */ })
  it('should handle user interaction', async () => { /* test */ })
})
```

**Relationships**:

- Tests -> Source File (1:1 mapping)
- Uses -> Test Utilities
- Uses -> MSW Handlers (for API tests)

---

## Relationships Diagram

```
                    ┌─────────────────────┐
                    │  vitest.config.js   │
                    │  (Test Config)      │
                    └─────────┬───────────┘
                              │ references
                              ▼
┌─────────────────────┐     ┌─────────────────────┐
│  vitest.setup.js    │────▶│  src/__mocks__/     │
│  (Setup)            │     │  server.js          │
└─────────┬───────────┘     │  handlers.js        │
          │                 └─────────────────────┘
          │ provides
          ▼
┌─────────────────────┐     ┌─────────────────────┐
│  src/test-utils/    │     │  *.test.jsx files   │
│  render.jsx         │◀────│  (Test Suites)      │
└─────────────────────┘     └─────────┬───────────┘
                                      │ produces
                                      ▼
                            ┌─────────────────────┐
                            │  coverage/          │
                            │  (Reports)          │
                            └─────────────────────┘
```

---

## File Inventory by Category

### UI Components to Test (7 files)

- `src/components/ui/Button.jsx`
- `src/components/ui/Checkbox.jsx`
- `src/components/ui/Input.jsx`
- `src/components/ui/Select.jsx`
- `src/components/AppIcon.jsx`
- `src/components/AppImage.jsx`
- `src/components/CookieConsent.jsx`

### Navigation Components to Test (5 files)

- `src/components/navigation/BreadcrumbNavigation.jsx`
- `src/components/navigation/NavigationSidebar.jsx`
- `src/components/navigation/NotificationCenter.jsx`
- `src/components/navigation/QuickActionToolbar.jsx`
- `src/components/navigation/UserProfileDropdown.jsx`

### Services to Test (9 files)

- `src/services/auditService.js`
- `src/services/authService.js`
- `src/services/complianceService.js`
- `src/services/dealService.js`
- `src/services/emailService.js`
- `src/services/partnerService.js`
- `src/services/productService.js`
- `src/services/quoteService.js`
- `src/services/registrationService.js`

### Utilities to Test (2 files)

- `src/utils/validators.js`
- `src/utils/cn.js`

### Contexts to Test (1 file)

- `src/contexts/AuthContext.jsx`

### Total Test Files to Create: 24+

(components + navigation + services + utilities + contexts + integration tests)
