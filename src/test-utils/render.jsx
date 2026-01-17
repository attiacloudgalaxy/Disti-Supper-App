import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'

/**
 * Custom render wrapper with providers for testing
 * Wraps components with AuthProvider and BrowserRouter
 *
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional render options
 * @param {Object} options.initialAuthState - Initial auth state to mock (optional)
 * @param {Object} options.initialRoute - Initial route path (optional)
 * @returns {Object} Render result with container, baseElement, etc.
 */
export function renderWithProviders(
  ui,
  {
    initialAuthState = null,
    initialRoute = '/',
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

// Re-export everything from testing-library/react
export * from '@testing-library/react'

// Re-export userEvent for simulating user interactions
export { default as userEvent } from '@testing-library/user-event'
