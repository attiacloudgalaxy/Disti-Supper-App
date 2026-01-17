import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW server setup for Node.js environment
 * This server intercepts HTTP requests during tests
 *
 * Handlers are combined from src/__mocks__/handlers.js
 */
export const server = setupServer(...handlers)
