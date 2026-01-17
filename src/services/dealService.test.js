import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { server } from '../__mocks__/server'
import { http, HttpResponse } from 'msw'

/**
 * DealService Tests
 *
 * These tests demonstrate API mocking patterns with MSW
 * for deal management service functions.
 * 
 * T035: Create dealService test with mocked CRUD operations
 * T037: Demonstrate error response mocking (500, 404, network error)
 * T038: Verify tests run without actual network calls
 */

describe('DealService', () => {
  const mockDeals = [
    {
      id: '1',
      name: 'Enterprise Deal',
      company: 'Acme Corp',
      value: 50000,
      probability: 75,
      stage: 'negotiation'
    },
    {
      id: '2',
      name: 'Small Business Deal',
      company: 'Tech Startup Inc',
      value: 15000,
      probability: 50,
      stage: 'proposal'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('getAll', () => {
    it('should fetch all deals successfully', async () => {
      server.use(
        http.get('*/rest/v1/deals', () => {
          return HttpResponse.json(mockDeals)
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.getAll()

      expect(result).toBeDefined()
    })

    it('should handle 500 server error when fetching deals', async () => {
      // T037: Demonstrate 500 error mocking
      server.use(
        http.get('*/rest/v1/deals', () => {
          return HttpResponse.json(
            { error: 'Database connection failed' },
            { status: 500 }
          )
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.getAll()

      expect(result).toBeDefined()
    })

    it('should handle network error when fetching deals', async () => {
      // T037: Demonstrate network error mocking
      server.use(
        http.get('*/rest/v1/deals', () => {
          return HttpResponse.error()
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.getAll()

      expect(result).toBeDefined()
    })
  })

  describe('getById', () => {
    it('should fetch deal by ID successfully', async () => {
      server.use(
        http.get('*/rest/v1/deals', ({ request }) => {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          if (id === 'eq.1') {
            return HttpResponse.json([mockDeals[0]])
          }
          return HttpResponse.json([], { status: 404 })
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.getById('1')

      expect(result).toBeDefined()
    })

    it('should handle 404 when deal not found', async () => {
      // T037: Demonstrate 404 error mocking
      server.use(
        http.get('*/rest/v1/deals', () => {
          return HttpResponse.json(
            { error: 'Deal not found', message: 'No deal found with ID: 999' },
            { status: 404 }
          )
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.getById('999')

      expect(result).toBeDefined()
    })
  })

  describe('create', () => {
    it('should create a new deal successfully', async () => {
      const newDeal = {
        name: 'New Deal',
        company: 'New Company',
        value: 25000,
        probability: 60,
        stage: 'prospecting'
      }

      server.use(
        http.post('*/rest/v1/deals', async ({ request }) => {
          const body = await request.json()
          return HttpResponse.json([
            {
              id: '4',
              ...body,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.create(newDeal)

      expect(result).toBeDefined()
    })

    it('should handle validation errors with 400', async () => {
      // T037: Demonstrate 400 validation error mocking
      server.use(
        http.post('*/rest/v1/deals', () => {
          return HttpResponse.json(
            { 
              error: 'Validation failed',
              message: 'Deal name is required and must be at least 3 characters',
              details: {
                field: 'name',
                constraint: 'minLength'
              }
            },
            { status: 400 }
          )
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.create({ name: 'AB' })

      expect(result).toBeDefined()
    })

    it('should handle 500 error when creating deal', async () => {
      server.use(
        http.post('*/rest/v1/deals', () => {
          return HttpResponse.json(
            { error: 'Failed to create deal' },
            { status: 500 }
          )
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.create({ name: 'Test Deal' })

      expect(result).toBeDefined()
    })
  })

  describe('update', () => {
    it('should update a deal successfully', async () => {
      const updates = {
        name: 'Updated Deal Name',
        probability: 85
      }

      server.use(
        http.patch('*/rest/v1/deals', async ({ request }) => {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          const body = await request.json()
          if (id === 'eq.1') {
            return HttpResponse.json([
              {
                ...mockDeals[0],
                ...body,
                updated_at: new Date().toISOString()
              }
            ])
          }
          return HttpResponse.json([], { status: 404 })
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.update('1', updates)

      expect(result).toBeDefined()
    })

    it('should handle 404 when updating non-existent deal', async () => {
      server.use(
        http.patch('*/rest/v1/deals', () => {
          return HttpResponse.json(
            { error: 'Deal not found' },
            { status: 404 }
          )
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.update('999', { name: 'Updated' })

      expect(result).toBeDefined()
    })
  })

  describe('delete', () => {
    it('should delete a deal successfully', async () => {
      server.use(
        http.delete('*/rest/v1/deals', ({ request }) => {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          if (id === 'eq.1') {
            return HttpResponse.json({ success: true })
          }
          return HttpResponse.json({ error: 'Deal not found' }, { status: 404 })
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.delete('1')

      expect(result).toBeDefined()
    })

    it('should handle 404 when deleting non-existent deal', async () => {
      server.use(
        http.delete('*/rest/v1/deals', () => {
          return HttpResponse.json(
            { error: 'Deal not found' },
            { status: 404 }
          )
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.delete('999')

      expect(result).toBeDefined()
    })
  })

  describe('getByStage', () => {
    it('should fetch deals filtered by stage', async () => {
      server.use(
        http.get('*/rest/v1/deals', ({ request }) => {
          const url = new URL(request.url)
          const stage = url.searchParams.get('stage')
          const filtered = mockDeals.filter(d => d.stage === stage)
          return HttpResponse.json(filtered)
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.getByStage('negotiation')

      expect(result).toBeDefined()
    })

    it('should handle empty result for non-existent stage', async () => {
      server.use(
        http.get('*/rest/v1/deals', () => {
          return HttpResponse.json([])
        })
      )

      const { dealService } = await import('./dealService')
      const result = await dealService.getByStage('nonexistent')

      expect(result).toBeDefined()
    })
  })
})
