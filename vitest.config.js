/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Environment - using happy-dom for better ESM compatibility
    environment: 'happy-dom',
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

    // Performance - using threads pool for better compatibility
    pool: 'threads',
    fileParallelism: true,

    // Watch mode
    watch: true,
    watchExclude: ['node_modules', 'build']
  }
})
