import { http, HttpResponse } from 'msw'

/**
 * MSW Handlers for Supabase Partner Management Endpoints
 * 
 * These handlers mock Supabase REST API endpoints for partners
 * for testing purposes, allowing tests to run without
 * actual network calls.
 */

const mockPartners = [
  {
    id: '1',
    company_name: 'Acme Corp',
    contact_name: 'John Doe',
    email: 'john@acme.com',
    phone: '+1-555-123-4567',
    website: 'https://acme.com',
    status: 'active',
    tier: 'gold',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    company_name: 'Tech Solutions Inc',
    contact_name: 'Jane Smith',
    email: 'jane@techsolutions.com',
    phone: '+1-555-987-6543',
    website: 'https://techsolutions.com',
    status: 'active',
    tier: 'platinum',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-16T00:00:00Z'
  },
  {
    id: '3',
    company_name: 'Global Distributors',
    contact_name: 'Bob Johnson',
    email: 'bob@globaldist.com',
    phone: '+1-555-456-7890',
    website: 'https://globaldist.com',
    status: 'inactive',
    tier: 'silver',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-17T00:00:00Z'
  }
]

export const partnerHandlers = [
  // GET /rest/v1/partners - Get all partners
  http.get('*/rest/v1/partners', ({ request }) => {
    const url = new URL(request.url)
    const select = url.searchParams.get('select')
    const status = url.searchParams.get('status')
    const tier = url.searchParams.get('tier')
    
    let partners = [...mockPartners]
    
    if (status) {
      partners = partners.filter(p => p.status === status)
    }
    
    if (tier) {
      partners = partners.filter(p => p.tier === tier)
    }
    
    return HttpResponse.json(partners)
  }),

  // GET /rest/v1/partners?id=eq.{id} - Get partner by ID
  http.get('*/rest/v1/partners', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const single = url.searchParams.get('single')
    
    if (id) {
      const partner = mockPartners.find(p => p.id === id.replace('eq.', ''))
      if (partner) {
        return HttpResponse.json([partner])
      }
      return HttpResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(mockPartners)
  }),

  // POST /rest/v1/partners - Create new partner
  http.post('*/rest/v1/partners', async ({ request }) => {
    const body = await request.json()
    
    return HttpResponse.json([
      {
        id: '4',
        company_name: body.company_name || 'New Partner',
        contact_name: body.contact_name || 'New Contact',
        email: body.email || 'new@partner.com',
        phone: body.phone || '+1-555-111-2222',
        website: body.website || 'https://newpartner.com',
        status: body.status || 'active',
        tier: body.tier || 'bronze',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
  }),

  // PATCH /rest/v1/partners?id=eq.{id} - Update partner
  http.patch('*/rest/v1/partners', async ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const body = await request.json()
    
    const partner = mockPartners.find(p => p.id === id.replace('eq.', ''))
    if (partner) {
      return HttpResponse.json([
        {
          ...partner,
          ...body,
          updated_at: new Date().toISOString()
        }
      ])
    }
    return HttpResponse.json(
      { error: 'Partner not found' },
      { status: 404 }
    )
  }),

  // DELETE /rest/v1/partners?id=eq.{id} - Delete partner
  http.delete('*/rest/v1/partners', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    const partner = mockPartners.find(p => p.id === id.replace('eq.', ''))
    if (partner) {
      return HttpResponse.json({ success: true })
    }
    return HttpResponse.json(
      { error: 'Partner not found' },
      { status: 404 }
    )
  })
]
