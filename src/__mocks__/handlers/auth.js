import { http, HttpResponse } from 'msw'

/**
 * MSW Handlers for Supabase Authentication Endpoints
 * 
 * These handlers mock the Supabase authentication API endpoints
 * for testing purposes, allowing tests to run without
 * actual network calls.
 */

const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
      role: 'Administrator'
    },
    aud: 'authenticated'
  },
  {
    id: '2',
    email: 'admin@example.com',
    user_metadata: {
      full_name: 'Admin User',
      role: 'Administrator'
    },
    aud: 'authenticated'
  }
]

export const authHandlers = [
  // POST /auth/v1/token?grant_type=password - User login
  http.post('*/auth/v1/token', async ({ request }) => {
    const url = new URL(request.url)
    const grantType = url.searchParams.get('grant_type')
    const body = await request.json()

    if (grantType === 'password') {
      const { email, password } = body

      // Mock authentication logic
      if (email === 'test@example.com' && password === 'password123') {
        return HttpResponse.json({
          user: mockUsers[0],
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            user: mockUsers[0]
          }
        })
      }

      if (email === 'admin@example.com' && password === 'admin123') {
        return HttpResponse.json({
          user: mockUsers[1],
          session: {
            access_token: 'mock-access-token-admin',
            refresh_token: 'mock-refresh-token-admin',
            expires_in: 3600,
            user: mockUsers[1]
          }
        })
      }

      return HttpResponse.json(
        { error: 'Invalid login credentials' },
        { status: 400 }
      )
    }

    if (grantType === 'refresh_token') {
      return HttpResponse.json({
        access_token: 'new-mock-access-token',
        expires_in: 3600,
        refresh_token: 'new-mock-refresh-token',
        user: mockUsers[0]
      })
    }

    return HttpResponse.json(
      { error: 'Invalid grant type' },
      { status: 400 }
    )
  }),

  // POST /auth/v1/logout - User logout
  http.post('*/auth/v1/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  // GET /auth/v1/user - Get current user
  http.get('*/auth/v1/user', () => {
    return HttpResponse.json(mockUsers[0])
  })
]
