import { http, HttpResponse } from 'msw'

/**
 * MSW Handlers for Supabase Audit Logs Endpoints
 * 
 * These handlers mock Supabase REST API endpoints for audit logs
 * for testing purposes, allowing tests to run without
 * actual network calls.
 */

export const auditHandlers = [
  // POST /rest/v1/audit_logs - Create audit log
  http.post('*/rest/v1/audit_logs', async () => {
    return HttpResponse.json([
      {
        id: '1',
        event_type: 'test.event',
        entity_type: 'test',
        entity_id: 'test-id',
        action: 'test',
        details: '{}',
        severity: 'info',
        created_at: new Date().toISOString()
      }
    ])
  })
]

export const certificationHandlers = [
  // GET /rest/v1/partner_certifications - Get certifications
  http.get('*/rest/v1/partner_certifications', ({ request }) => {
    const url = new URL(request.url)
    const partnerId = url.searchParams.get('partner_id')
    
    return HttpResponse.json([
      {
        id: '1',
        name: 'Gold Certification',
        issued_date: '2023-01-15',
        expiry_date: '2025-01-15',
        partner_id: partnerId?.replace('eq.', '') || '1'
      },
      {
        id: '2',
        name: 'Premium Partner',
        issued_date: '2023-06-01',
        expiry_date: '2024-06-01',
        partner_id: partnerId?.replace('eq.', '') || '1'
      }
    ])
  })
]
