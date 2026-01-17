# Quickstart: Unit Testing in DistributorHub

**Feature Branch**: `001-unit-testing`
**Date**: 2025-01-17

## Getting Started

### Installation

```bash
# Install test dependencies
npm install -D vitest @vitest/coverage-v8 @vitest/ui jsdom msw vitest-axe

# Upgrade React Testing Library to latest
npm install -D @testing-library/react@latest @testing-library/user-event@latest
```

### Running Tests

```bash
# Run tests in watch mode (default)
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

---

## Writing Your First Test

### Component Test

Create a test file next to your component:

```
src/components/ui/Button.jsx
src/components/ui/Button.test.jsx  <-- Create this
```

```javascript
// Button.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'test-utils/render'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    renderWithProviders(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Service Test

Create a test file next to your service:

```
src/services/dealService.js
src/services/dealService.test.js  <-- Create this
```

```javascript
// dealService.test.js
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '__mocks__/server'
import { dealService } from './dealService'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

describe('dealService', () => {
  it('fetches deals successfully', async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/deals`, () => {
        return HttpResponse.json([
          { id: '1', name: 'Deal A' },
          { id: '2', name: 'Deal B' }
        ])
      })
    )

    const { data, error } = await dealService.getDeals()

    expect(error).toBeNull()
    expect(data).toHaveLength(2)
  })

  it('handles API errors', async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/deals`, () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )

    const { data, error } = await dealService.getDeals()

    expect(data).toBeNull()
    expect(error).toBeDefined()
  })
})
```

---

## Testing Patterns

### Query Elements by Role (Recommended)

```javascript
// Good - accessible and resilient
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('heading', { level: 1 })

// Avoid - brittle
screen.getByTestId('submit-button')
screen.getByClassName('submit-btn')
```

### Simulate User Interactions

```javascript
const user = userEvent.setup()

// Click
await user.click(screen.getByRole('button'))

// Type
await user.type(screen.getByRole('textbox'), 'Hello')

// Clear and type
await user.clear(screen.getByRole('textbox'))
await user.type(screen.getByRole('textbox'), 'New value')

// Select
await user.selectOptions(screen.getByRole('combobox'), 'option-value')

// Keyboard
await user.keyboard('{Enter}')
await user.keyboard('{Tab}')
```

### Test Async Operations

```javascript
// Wait for element to appear
const element = await screen.findByText('Loaded')

// Wait for condition
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument()
})
```

### Test Accessibility

```javascript
import { axe } from 'vitest-axe'

it('has no accessibility violations', async () => {
  const { container } = renderWithProviders(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## Mocking API Calls

### Default Handlers

Handlers in `src/__mocks__/handlers.js` run for all tests. Override them per-test:

```javascript
import { server } from '__mocks__/server'
import { http, HttpResponse } from 'msw'

it('handles empty response', async () => {
  // Override just for this test
  server.use(
    http.get('*/rest/v1/deals', () => {
      return HttpResponse.json([])
    })
  )

  // Test runs with empty deals
})
```

### Simulate Errors

```javascript
// Network error
server.use(
  http.get('*/api/data', () => HttpResponse.error())
)

// Server error
server.use(
  http.get('*/api/data', () => HttpResponse.json(
    { message: 'Internal Server Error' },
    { status: 500 }
  ))
)

// Timeout (use delay)
server.use(
  http.get('*/api/data', async () => {
    await delay(10000) // 10 seconds
    return HttpResponse.json({ data: 'late' })
  })
)
```

---

## Testing with Redux

### Pre-populate State

```javascript
it('shows items from Redux state', () => {
  const preloadedState = {
    deals: {
      items: [{ id: '1', name: 'Test Deal' }],
      loading: false
    }
  }

  renderWithProviders(<DealsList />, { preloadedState })

  expect(screen.getByText('Test Deal')).toBeInTheDocument()
})
```

### Verify Redux Actions

```javascript
it('dispatches action on button click', async () => {
  const { store } = renderWithProviders(<AddDealButton />)
  const user = userEvent.setup()

  await user.click(screen.getByRole('button', { name: /add deal/i }))

  const actions = store.getState()
  expect(actions.deals.items).toHaveLength(1)
})
```

---

## Common Assertions

```javascript
// Presence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()
expect(element).toBeDisabled()
expect(element).toBeEnabled()

// Content
expect(element).toHaveTextContent('text')
expect(element).toHaveValue('value')
expect(element).toHaveAttribute('href', '/path')

// Classes
expect(element).toHaveClass('active')

// Form state
expect(element).toBeRequired()
expect(element).toBeInvalid()
expect(element).toBeValid()
```

---

## Test Organization

### File Naming

```
ComponentName.test.jsx   # Component tests
serviceName.test.js      # Service tests
```

### Test Structure

```javascript
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders default state', () => {})
    it('renders with props', () => {})
  })

  describe('User Interactions', () => {
    it('handles click', () => {})
    it('handles input', () => {})
  })

  describe('Edge Cases', () => {
    it('handles empty data', () => {})
    it('handles error state', () => {})
  })

  describe('Accessibility', () => {
    it('has no violations', () => {})
  })
})
```

---

## Debugging Tests

### See What's Rendered

```javascript
import { screen } from '@testing-library/react'

it('debug example', () => {
  renderWithProviders(<MyComponent />)

  // Print DOM to console
  screen.debug()

  // Print specific element
  screen.debug(screen.getByRole('button'))
})
```

### Use Vitest UI

```bash
npm run test:ui
```

Opens a browser-based UI showing all tests, their status, and allows re-running individual tests.

---

## Coverage Reports

After running `npm run test:coverage`:

- **Terminal**: Summary printed to console
- **HTML Report**: Open `coverage/index.html` in browser
- **Thresholds**: Tests fail if coverage drops below 80%

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run in watch mode |
| `npm run test:run` | Run once |
| `npm run test:coverage` | Run with coverage |
| `npm run test:ui` | Open visual UI |

| Query | When to Use |
|-------|-------------|
| `getByRole` | Buttons, inputs, headings |
| `getByLabelText` | Form inputs with labels |
| `getByText` | Non-interactive text |
| `findByRole` | Async elements |
| `queryByRole` | Check absence |
