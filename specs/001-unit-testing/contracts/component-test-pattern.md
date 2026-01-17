# Component Test Pattern

**Purpose**: Standard pattern for testing React components

## Template

```javascript
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { renderWithProviders } from 'test-utils/render'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  // Setup user event instance for realistic interactions
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<ComponentName />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders with required props', () => {
      renderWithProviders(<ComponentName label="Test" />)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = renderWithProviders(
        <ComponentName className="custom-class" />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('User Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn()
      renderWithProviders(<ComponentName onClick={handleClick} />)

      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles keyboard navigation', async () => {
      const handleClick = vi.fn()
      renderWithProviders(<ComponentName onClick={handleClick} />)

      screen.getByRole('button').focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('States', () => {
    it('shows loading state', () => {
      renderWithProviders(<ComponentName loading />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('shows disabled state', () => {
      renderWithProviders(<ComponentName disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('shows error state', () => {
      renderWithProviders(<ComponentName error="Error message" />)
      expect(screen.getByText('Error message')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderWithProviders(<ComponentName />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has accessible name', () => {
      renderWithProviders(<ComponentName aria-label="Action button" />)
      expect(screen.getByRole('button', { name: 'Action button' })).toBeInTheDocument()
    })
  })
})
```

## Query Priority

Use queries in this order (per Testing Library best practices):

1. **getByRole** - Most accessible, survives refactors
2. **getByLabelText** - For form elements
3. **getByPlaceholderText** - For inputs without labels
4. **getByText** - For non-interactive elements
5. **getByTestId** - Last resort only

## Assertions

Common assertions for components:

```javascript
// Presence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()
expect(element).not.toBeVisible()

// State
expect(element).toBeDisabled()
expect(element).toBeEnabled()
expect(element).toHaveClass('active')

// Content
expect(element).toHaveTextContent('text')
expect(element).toHaveValue('value')
expect(element).toHaveAttribute('href', '/path')
```

## Async Patterns

```javascript
// Wait for element to appear
const element = await screen.findByRole('button')

// Wait for condition
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument()
})
```
