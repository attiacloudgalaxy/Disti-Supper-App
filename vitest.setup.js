import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import * as axeMatchers from 'vitest-axe/matchers'
import { server } from './src/__mocks__/server'

// Mock MSAL browser to prevent crypto errors in Node.js environment
vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(function () {
    this.initialize = vi.fn().mockResolvedValue(undefined);
    this.getAllAccounts = vi.fn().mockReturnValue([]);
    this.acquireTokenSilent = vi.fn().mockResolvedValue({ accessToken: 'mock-token' });
    this.acquireTokenPopup = vi.fn().mockResolvedValue({ accessToken: 'mock-token' });
    this.loginPopup = vi.fn().mockResolvedValue({ accessToken: 'mock-token' });
    this.logout = vi.fn().mockResolvedValue(undefined);
  }),
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
