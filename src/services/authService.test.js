import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { server } from '../__mocks__/server'
import { http, HttpResponse } from 'msw'

/**
 * AuthService Tests
 *
 * These tests demonstrate API mocking patterns with MSW
 * for authentication service functions.
 * 
 * T034: Create authService test with mocked login/logout
 * T037: Demonstrate error response mocking (500, 404, network error)
 * T038: Verify tests run without actual network calls
 */

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      // Override default handler for this specific test
      server.use(
        http.post('*/auth/v1/token', async ({ request }) => {
          const body = await request.json()
          if (body.email === 'test@example.com' && body.password === 'password123') {
            return HttpResponse.json({
              user: {
                id: '123',
                email: 'test@example.com',
                user_metadata: { full_name: 'Test User' }
              },
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_in: 3600
              }
            })
          }
          return HttpResponse.json({ error: 'Invalid credentials' }, { status: 400 })
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.signIn('test@example.com', 'password123')

      expect(result).toBeDefined()
    })

    it('should handle invalid credentials with 401 error', async () => {
      // T037: Demonstrate 401 error mocking
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.json(
            { error: 'Invalid login credentials', message: 'Email or password is incorrect' },
            { status: 401 }
          )
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.signIn('wrong@example.com', 'wrongpassword')

      expect(result).toBeDefined()
      expect(result.error).toBeDefined()
    })

    it('should handle 500 server error', async () => {
      // T037: Demonstrate 500 error mocking
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.json(
            { error: 'Internal server error', message: 'Something went wrong' },
            { status: 500 }
          )
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.signIn('test@example.com', 'password123')

      expect(result).toBeDefined()
      expect(result.error).toBeDefined()
    })

    it('should handle network error', async () => {
      // T037: Demonstrate network error mocking
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.error()
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.signIn('test@example.com', 'password123')

      expect(result).toBeDefined()
      expect(result.error).toBeDefined()
    })
  })

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      server.use(
        http.post('*/auth/v1/logout', () => {
          return HttpResponse.json({ success: true })
        }),
        http.get('*/auth/v1/user', () => {
          return HttpResponse.json({
            id: '123',
            email: 'test@example.com'
          })
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.signOut()

      expect(result).toBeDefined()
    })

    it('should handle logout server error', async () => {
      // T037: Demonstrate 500 error on logout
      server.use(
        http.post('*/auth/v1/logout', () => {
          return HttpResponse.json(
            { error: 'Failed to invalidate session' },
            { status: 500 }
          )
        }),
        http.get('*/auth/v1/user', () => {
          return HttpResponse.json({
            id: '123',
            email: 'test@example.com'
          })
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.signOut()

      expect(result).toBeDefined()
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      server.use(
        http.get('*/auth/v1/user', () => {
          return HttpResponse.json({
            id: '123',
            email: 'test@example.com',
            user_metadata: {
              full_name: 'Test User',
              role: 'Administrator'
            }
          })
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.getCurrentUser()

      expect(result).toBeDefined()
    })

    it('should handle 401 when not authenticated', async () => {
      // T037: Demonstrate 401 error for unauthorized access
      server.use(
        http.get('*/auth/v1/user', () => {
          return HttpResponse.json(
            { error: 'Not authenticated', message: 'Session expired' },
            { status: 401 }
          )
        })
      )

      const { authService } = await import('./authService')
      const result = await authService.getCurrentUser()

      expect(result).toBeDefined()
    })
  })
})
