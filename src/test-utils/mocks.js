/**
 * Mock data factories for common entities
 * These factories create consistent test data with optional overrides
 */

/**
 * Create a mock user object
 * @param {Object} overrides - Optional properties to override defaults
 * @returns {Object} Mock user object
 */
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    email: 'test@example.com',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    user_metadata: {
      full_name: 'Test User',
      email: 'test@example.com',
      provider: 'email'
    },
    ...overrides
  }
}

/**
 * Create a mock deal object
 * @param {Object} overrides - Optional properties to override defaults
 * @returns {Object} Mock deal object
 */
export function createMockDeal(overrides = {}) {
  return {
    id: '1',
    name: 'Test Deal',
    status: 'pending',
    value: 10000,
    partner_id: 'partner-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  }
}

/**
 * Create a mock partner object
 * @param {Object} overrides - Optional properties to override defaults
 * @returns {Object} Mock partner object
 */
export function createMockPartner(overrides = {}) {
  return {
    id: '1',
    name: 'Test Partner',
    email: 'partner@example.com',
    status: 'active',
    tier: 'gold',
    created_at: new Date().toISOString(),
    ...overrides
  }
}

/**
 * Create a mock product object
 * @param {Object} overrides - Optional properties to override defaults
 * @returns {Object} Mock product object
 */
export function createMockProduct(overrides = {}) {
  return {
    id: '1',
    name: 'Test Product',
    sku: 'SKU-001',
    price: 100,
    stock: 50,
    category: 'electronics',
    created_at: new Date().toISOString(),
    ...overrides
  }
}

/**
 * Create a mock quote object
 * @param {Object} overrides - Optional properties to override defaults
 * @returns {Object} Mock quote object
 */
export function createMockQuote(overrides = {}) {
  return {
    id: '1',
    deal_id: 'deal-1',
    total: 10000,
    status: 'draft',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    ...overrides
  }
}

/**
 * Create a mock user profile object
 * @param {Object} overrides - Optional properties to override defaults
 * @returns {Object} Mock user profile object
 */
export function createMockUserProfile(overrides = {}) {
  return {
    id: '1',
    full_name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    phone: '+1-555-0123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  }
}
