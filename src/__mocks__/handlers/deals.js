import { http, HttpResponse } from 'msw'

/**
 * MSW Handlers for Supabase Deal Management Endpoints
 * 
 * These handlers mock Supabase REST API endpoints for deals
 * for testing purposes, allowing tests to run without
 * actual network calls.
 */

const mockDeals = [
  {
    id: '1',
    name: 'Enterprise Deal',
    company: 'Acme Corp',
    value: 50000,
    probability: 75,
    stage: 'negotiation',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Small Business Deal',
    company: 'Tech Startup Inc',
    value: 15000,
    probability: 50,
    stage: 'proposal',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-16T00:00:00Z'
  },
  {
    id: '3',
    name: 'Government Contract',
    company: 'City Agency',
    value: 100000,
    probability: 90,
    stage: 'closing',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-17T00:00:00Z'
  }
]

export const dealHandlers = [
  // GET /rest/v1/deals - Get all deals
  http.get('*/rest/v1/deals', ({ request }) => {
    const url = new URL(request.url)
    const select = url.searchParams.get('select')
    const stage = url.searchParams.get('stage')
    
    let deals = [...mockDeals]
    
    if (stage) {
      deals = deals.filter(d => d.stage === stage)
    }
    
    return HttpResponse.json(deals)
  }),

  // GET /rest/v1/deals?id=eq.{id} - Get deal by ID
  http.get('*/rest/v1/deals', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const single = url.searchParams.get('single')
    
    if (id) {
      const deal = mockDeals.find(d => d.id === id.replace('eq.', ''))
      if (deal) {
        return HttpResponse.json([deal])
      }
      return HttpResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(mockDeals)
  }),

  // POST /rest/v1/deals - Create new deal
  http.post('*/rest/v1/deals', async ({ request }) => {
    const body = await request.json()
    
    return HttpResponse.json([
      {
        id: '4',
        name: body.name || 'New Deal',
        company: body.company || 'New Company',
        value: body.value || 25000,
        probability: body.probability || 60,
        stage: body.stage || 'prospecting',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
  }),

  // PATCH /rest/v1/deals?id=eq.{id} - Update deal
  http.patch('*/rest/v1/deals', async ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const body = await request.json()
    
    const deal = mockDeals.find(d => d.id === id.replace('eq.', ''))
    if (deal) {
      return HttpResponse.json([
        {
          ...deal,
          ...body,
          updated_at: new Date().toISOString()
        }
      ])
    }
    return HttpResponse.json(
      { error: 'Deal not found' },
      { status: 404 }
    )
  }),

  // DELETE /rest/v1/deals?id=eq.{id} - Delete deal
  http.delete('*/rest/v1/deals', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    const deal = mockDeals.find(d => d.id === id.replace('eq.', ''))
    if (deal) {
      return HttpResponse.json({ success: true })
    }
    return HttpResponse.json(
      { error: 'Deal not found' },
      { status: 404 }
    )
  })
]
