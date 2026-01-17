# Vitest Configuration Template

**Purpose**: Reference configuration for vitest.config.js

## vitest.config.js

```javascript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Environment
    environment: 'jsdom',
    globals: true,

    // Setup
    setupFiles: ['./vitest.setup.js'],

    // File patterns
    include: ['src/**/*.test.{js,jsx}'],
    exclude: ['node_modules', 'build', 'Chaos'],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/__mocks__/**',
        'src/test-utils/**',
        'src/index.jsx',
        'src/Routes.jsx'
      ],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80
      }
    },

    // Performance
    pool: 'forks',
    fileParallelism: true,

    // Watch mode
    watch: true,
    watchExclude: ['node_modules', 'build']
  }
})
```

## vitest.setup.js

```javascript
import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import * as axeMatchers from 'vitest-axe/matchers'
import { server } from './src/__mocks__/server'

// Extend expect with DOM matchers
expect.extend(matchers)

// Extend expect with accessibility matchers
expect.extend(axeMatchers)

// Cleanup DOM after each test
afterEach(() => {
  cleanup()
})

// MSW server lifecycle
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
```

## package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## MSW Setup Files

### src/__mocks__/server.js

```javascript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### src/__mocks__/handlers.js

```javascript
import { authHandlers } from './handlers/auth'
import { dealHandlers } from './handlers/deals'
import { partnerHandlers } from './handlers/partners'

export const handlers = [
  ...authHandlers,
  ...dealHandlers,
  ...partnerHandlers
]
```

### src/__mocks__/handlers/auth.js

```javascript
import { http, HttpResponse } from 'msw'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://localhost:54321'

export const authHandlers = [
  // Sign in
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const body = await request.json()
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: '1',
          email: body.email,
          role: 'authenticated'
        }
      })
    }
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Get current user
  http.get(`${SUPABASE_URL}/auth/v1/user`, ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth?.includes('mock-access-token')) {
      return HttpResponse.json({
        id: '1',
        email: 'test@example.com'
      })
    }
    return HttpResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }),

  // Sign out
  http.post(`${SUPABASE_URL}/auth/v1/logout`, () => {
    return new HttpResponse(null, { status: 204 })
  })
]
```

## Test Utilities

### src/test-utils/render.jsx

```javascript
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from 'store/rootReducer'

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
```

### src/test-utils/mocks.js

```javascript
// Mock user factory
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    email: 'test@example.com',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides
  }
}

// Mock deal factory
export function createMockDeal(overrides = {}) {
  return {
    id: '1',
    name: 'Test Deal',
    status: 'pending',
    value: 10000,
    created_at: new Date().toISOString(),
    ...overrides
  }
}

// Mock partner factory
export function createMockPartner(overrides = {}) {
  return {
    id: '1',
    name: 'Test Partner',
    email: 'partner@example.com',
    status: 'active',
    ...overrides
  }
}
```

## Environment Variables for Tests

Create `.env.test`:

```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=mock-anon-key
VITE_EMAIL_ENABLED=false
```

## Directory Structure

```
/
├── vitest.config.js
├── vitest.setup.js
├── .env.test
└── src/
    ├── __mocks__/
    │   ├── server.js
    │   ├── handlers.js
    │   └── handlers/
    │       ├── auth.js
    │       ├── deals.js
    │       └── partners.js
    └── test-utils/
        ├── render.jsx
        └── mocks.js
```
