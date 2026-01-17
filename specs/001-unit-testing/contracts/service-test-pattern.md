# Service Test Pattern

**Purpose**: Standard pattern for testing service layer (API calls, business logic)

## Template

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '__mocks__/server'
import { serviceName } from './serviceName'

// Mock Supabase URL from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

describe('serviceName', () => {
  describe('getItems', () => {
    it('returns items on success', async () => {
      // Arrange - MSW handler already set up in handlers.js
      // Or override for specific test:
      server.use(
        http.get(`${SUPABASE_URL}/rest/v1/items`, () => {
          return HttpResponse.json([
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
          ])
        })
      )

      // Act
      const { data, error } = await serviceName.getItems()

      // Assert
      expect(error).toBeNull()
      expect(data).toHaveLength(2)
      expect(data[0]).toMatchObject({ id: 1, name: 'Item 1' })
    })

    it('returns error on network failure', async () => {
      server.use(
        http.get(`${SUPABASE_URL}/rest/v1/items`, () => {
          return HttpResponse.error()
        })
      )

      const { data, error } = await serviceName.getItems()

      expect(data).toBeNull()
      expect(error).toBeDefined()
    })

    it('returns error on server error', async () => {
      server.use(
        http.get(`${SUPABASE_URL}/rest/v1/items`, () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      const { data, error } = await serviceName.getItems()

      expect(data).toBeNull()
      expect(error).toBeDefined()
    })
  })

  describe('createItem', () => {
    it('creates item successfully', async () => {
      const newItem = { name: 'New Item' }

      server.use(
        http.post(`${SUPABASE_URL}/rest/v1/items`, async ({ request }) => {
          const body = await request.json()
          return HttpResponse.json(
            { id: 1, ...body },
            { status: 201 }
          )
        })
      )

      const { data, error } = await serviceName.createItem(newItem)

      expect(error).toBeNull()
      expect(data).toMatchObject({ id: 1, name: 'New Item' })
    })

    it('validates required fields', async () => {
      const invalidItem = { name: '' }

      const { data, error } = await serviceName.createItem(invalidItem)

      expect(data).toBeNull()
      expect(error).toBeDefined()
      expect(error.message).toContain('required')
    })

    it('handles duplicate key error', async () => {
      server.use(
        http.post(`${SUPABASE_URL}/rest/v1/items`, () => {
          return HttpResponse.json(
            { message: 'duplicate key value violates unique constraint' },
            { status: 409 }
          )
        })
      )

      const { data, error } = await serviceName.createItem({ name: 'Existing' })

      expect(data).toBeNull()
      expect(error).toBeDefined()
    })
  })

  describe('updateItem', () => {
    it('updates item successfully', async () => {
      server.use(
        http.patch(`${SUPABASE_URL}/rest/v1/items`, () => {
          return HttpResponse.json({ id: 1, name: 'Updated' })
        })
      )

      const { data, error } = await serviceName.updateItem(1, { name: 'Updated' })

      expect(error).toBeNull()
      expect(data.name).toBe('Updated')
    })

    it('returns error for non-existent item', async () => {
      server.use(
        http.patch(`${SUPABASE_URL}/rest/v1/items`, () => {
          return HttpResponse.json(
            { message: 'Not found' },
            { status: 404 }
          )
        })
      )

      const { data, error } = await serviceName.updateItem(999, { name: 'Updated' })

      expect(data).toBeNull()
      expect(error).toBeDefined()
    })
  })

  describe('deleteItem', () => {
    it('deletes item successfully', async () => {
      server.use(
        http.delete(`${SUPABASE_URL}/rest/v1/items`, () => {
          return new HttpResponse(null, { status: 204 })
        })
      )

      const { error } = await serviceName.deleteItem(1)

      expect(error).toBeNull()
    })
  })
})
```

## Service Return Pattern

All services should follow this return pattern:

```javascript
// Success
{ data: result, error: null }

// Error
{ data: null, error: { message: 'Error description' } }
```

## MSW Handler Examples

```javascript
// handlers/items.js
import { http, HttpResponse } from 'msw'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL

export const itemHandlers = [
  // GET all items
  http.get(`${SUPABASE_URL}/rest/v1/items`, () => {
    return HttpResponse.json([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ])
  }),

  // GET single item
  http.get(`${SUPABASE_URL}/rest/v1/items/:id`, ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Item' })
  }),

  // POST create item
  http.post(`${SUPABASE_URL}/rest/v1/items`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 1, ...body }, { status: 201 })
  }),

  // PATCH update item
  http.patch(`${SUPABASE_URL}/rest/v1/items`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 1, ...body })
  }),

  // DELETE item
  http.delete(`${SUPABASE_URL}/rest/v1/items`, () => {
    return new HttpResponse(null, { status: 204 })
  })
]
```

## Error Scenarios to Test

1. **Network errors** - Connection failures
2. **Server errors** - 500 responses
3. **Validation errors** - 400 responses
4. **Not found** - 404 responses
5. **Unauthorized** - 401 responses
6. **Rate limiting** - 429 responses
7. **Timeout** - Request timeout handling
