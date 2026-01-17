import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import * as axeMatchers from 'vitest-axe/matchers'
import { server } from './src/__mocks__/server'

// Mock MSAL browser to prevent crypto errors in Node.js environment
vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn().mockImplementation(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    getAllAccounts: vi.fn().mockReturnValue([]),
    acquireTokenSilent: vi.fn().mockResolvedValue({ accessToken: 'mock-token' }),
    acquireTokenPopup: vi.fn().mockResolvedValue({ accessToken: 'mock-token' }),
  })),
}))

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
