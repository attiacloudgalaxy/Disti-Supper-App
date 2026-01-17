# Integration Test Pattern

**Purpose**: Standard pattern for testing feature flows across multiple components

## Template

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '__mocks__/server'
import { renderWithProviders } from 'test-utils/render'
import { FeaturePage } from 'pages/feature-name'

describe('Feature: User Authentication Flow', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Reset to logged-out state
    server.resetHandlers()
  })

  describe('Login Flow', () => {
    it('allows user to log in with valid credentials', async () => {
      // Arrange
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.json({
            access_token: 'mock-token',
            user: { id: '1', email: 'user@example.com' }
          })
        })
      )

      renderWithProviders(<LoginPage />)

      // Act
      await user.type(screen.getByLabelText(/email/i), 'user@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument()
      })
    })

    it('shows error message for invalid credentials', async () => {
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          )
        })
      )

      renderWithProviders(<LoginPage />)

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/invalid/i)
      })
    })
  })

  describe('Data Management Flow', () => {
    it('allows user to create, view, and delete an item', async () => {
      // Setup: User is authenticated
      const preloadedState = {
        auth: { user: { id: '1' }, isAuthenticated: true }
      }

      // Mock API responses
      let items = []
      server.use(
        http.get('*/rest/v1/items', () => HttpResponse.json(items)),
        http.post('*/rest/v1/items', async ({ request }) => {
          const body = await request.json()
          const newItem = { id: '1', ...body }
          items.push(newItem)
          return HttpResponse.json(newItem, { status: 201 })
        }),
        http.delete('*/rest/v1/items', () => {
          items = []
          return new HttpResponse(null, { status: 204 })
        })
      )

      renderWithProviders(<ItemManagementPage />, { preloadedState })

      // Create item
      await user.click(screen.getByRole('button', { name: /add item/i }))
      await user.type(screen.getByLabelText(/name/i), 'Test Item')
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Verify item appears in list
      await waitFor(() => {
        expect(screen.getByText('Test Item')).toBeInTheDocument()
      })

      // Delete item
      const itemRow = screen.getByText('Test Item').closest('tr')
      await user.click(within(itemRow).getByRole('button', { name: /delete/i }))
      await user.click(screen.getByRole('button', { name: /confirm/i }))

      // Verify item removed
      await waitFor(() => {
        expect(screen.queryByText('Test Item')).not.toBeInTheDocument()
      })
    })
  })
})
```

## Testing User Journeys

Focus on complete user journeys, not individual component behavior:

```javascript
describe('User Journey: New User Onboarding', () => {
  it('completes full onboarding flow', async () => {
    // Step 1: Land on welcome page
    renderWithProviders(<App />, { route: '/welcome' })
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument()

    // Step 2: Click get started
    await user.click(screen.getByRole('button', { name: /get started/i }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    })

    // Step 3: Fill registration form
    await user.type(screen.getByLabelText(/email/i), 'new@example.com')
    await user.type(screen.getByLabelText(/password/i), 'SecurePass123!')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Step 4: Complete profile
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /complete profile/i })).toBeInTheDocument()
    })
    await user.type(screen.getByLabelText(/company/i), 'Acme Corp')
    await user.click(screen.getByRole('button', { name: /finish/i }))

    // Step 5: Arrive at dashboard
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    })
  })
})
```

## Router Testing

```javascript
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from 'Routes'

function renderWithRouter(initialEntries = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries })
  return renderWithProviders(<RouterProvider router={router} />)
}

it('navigates between pages', async () => {
  renderWithRouter(['/'])

  // Click navigation link
  await user.click(screen.getByRole('link', { name: /deals/i }))

  // Verify navigation
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /deals/i })).toBeInTheDocument()
  })
})
```

## State Verification

```javascript
it('updates Redux state correctly', async () => {
  const { store } = renderWithProviders(<FeaturePage />)

  await user.click(screen.getByRole('button', { name: /add item/i }))

  // Verify Redux state
  const state = store.getState()
  expect(state.items.list).toHaveLength(1)
})
```

## Integration Test Categories

1. **Authentication flows** - Login, logout, session management
2. **CRUD operations** - Create, read, update, delete cycles
3. **Navigation flows** - Page transitions, deep linking
4. **Form submissions** - Multi-step forms, validation
5. **Error recovery** - Error states to success states
