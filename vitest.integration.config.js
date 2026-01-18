/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Vitest Configuration for Integration Tests
 * Tests interactions between multiple components and services
 */
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Environment
    environment: 'jsdom',
    globals: true,

    // Setup
    setupFiles: ['./vitest.setup.js'],

    // File patterns - only integration tests
    include: ['tests/integration/**/*.test.{js,jsx}'],
    exclude: ['node_modules', 'build', 'Chaos'],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage/integration',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/__mocks__/**',
        'src/test-utils/**',
        'src/index.jsx',
      ],
      thresholds: {
        lines: 60,
        branches: 55,
        functions: 60,
        statements: 60
      }
    },

    // Performance
    pool: 'forks',
    fileParallelism: true,

    // Timeouts (longer for integration tests)
    testTimeout: 30000,
    hookTimeout: 30000,

    // Watch mode
    watch: false,
  }
})
