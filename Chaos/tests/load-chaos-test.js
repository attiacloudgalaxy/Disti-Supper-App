import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

/**
 * Distribution Company - Chaos Load Testing
 * Combines load testing with chaos scenarios
 */

// Custom metrics
const errorRate = new Rate('errors');
const orderDuration = new Trend('order_duration');
const inventoryConflicts = new Counter('inventory_conflicts');
const paymentFailures = new Counter('payment_failures');

// Test configuration
export const options = {
  scenarios: {
    // Normal load baseline
    normal_traffic: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },   // Ramp up
        { duration: '5m', target: 50 },   // Steady state
        { duration: '2m', target: 100 },  // Peak load
        { duration: '5m', target: 100 },  // Sustained peak
        { duration: '2m', target: 0 },    // Ramp down
      ],
      gracefulRampDown: '30s',
    },
    
    // Spike test - sudden traffic burst
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 200 }, // Instant spike
        { duration: '1m', target: 200 },  // Hold spike
        { duration: '10s', target: 0 },   // Drop
      ],
      startTime: '5m', // Start after normal traffic establishes
    },
    
    // Stress test - find breaking point
    stress_test: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 500,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 300 },  // Breaking point?
      ],
      startTime: '15m',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
    errors: ['rate<0.05'],          // Less than 5% errors
    inventory_conflicts: ['count<10'],
    payment_failures: ['count<5'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api';

// ============================================
// ADMIN SCENARIOS
// ============================================

export function adminScenarios() {
  group('Admin: User Management', () => {
    // Bulk user creation
    const users = [];
    for (let i = 0; i < 10; i++) {
      const res = http.post(`${BASE_URL}/admin/users`, JSON.stringify({
        email: `load-test-${Date.now()}-${i}@example.com`,
        role: 'partner',
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
      
      check(res, {
        'user created': (r) => r.status === 201,
        'response time OK': (r) => r.timings.duration < 1000,
      });
      
      if (res.status === 201) {
        users.push(JSON.parse(res.body).id);
      }
      errorRate.add(res.status !== 201);
    }
    
    // Concurrent user updates (race condition test)
    const updatePromises = users.map(userId => 
      http.put(`${BASE_URL}/admin/users/${userId}`, JSON.stringify({
        role: Math.random() > 0.5 ? 'admin' : 'partner',
      }), {
        headers: { 'Content-Type': 'application/json' },
      })
    );
    
    sleep(1);
  });

  group('Admin: Inventory Chaos', () => {
    // Rapid stock updates
    const productId = 'test-product-1';
    
    for (let i = 0; i < 20; i++) {
      const stockChange = Math.floor(Math.random() * 100) - 50; // -50 to +50
      
      const res = http.patch(`${BASE_URL}/admin/products/${productId}/stock`, JSON.stringify({
        adjustment: stockChange,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
      
      check(res, {
        'stock updated': (r) => r.status === 200 || r.status === 400,
        'no negative stock': (r) => {
          if (r.status === 200) {
            const body = JSON.parse(r.body);
            return body.newStock >= 0;
          }
          return true;
        },
      });
      
      if (res.status === 409) {
        inventoryConflicts.add(1);
      }
    }
    
    sleep(0.5);
  });

  group('Admin: Report Generation Under Load', () => {
    // Large report generation
    const res = http.get(`${BASE_URL}/admin/reports/sales`, {
      headers: { 'Content-Type': 'application/json' },
      timeout: '30s',
    }, {
      tags: { name: 'large_report' },
    });
    
    check(res, {
      'report generated': (r) => r.status === 200,
      'response under 30s': (r) => r.timings.duration < 30000,
    });
    
    errorRate.add(res.status !== 200);
  });
}

// ============================================
// PARTNER SCENARIOS
// ============================================

export function partnerScenarios() {
  group('Partner: Order Creation Storm', () => {
    const startTime = Date.now();
    
    // Simulate order rush
    const orderData = {
      partnerId: `partner-${__VU}`,
      items: [
        { productId: 'popular-item-1', quantity: Math.ceil(Math.random() * 5) },
        { productId: 'popular-item-2', quantity: Math.ceil(Math.random() * 3) },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        zip: '12345',
      },
    };
    
    const res = http.post(`${BASE_URL}/partner/orders`, JSON.stringify(orderData), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    orderDuration.add(Date.now() - startTime);
    
    check(res, {
      'order accepted or rejected gracefully': (r) => 
        [200, 201, 400, 409].includes(r.status),
      'no server errors': (r) => r.status < 500,
    });
    
    if (res.status === 409) {
      inventoryConflicts.add(1);
    }
    
    errorRate.add(res.status >= 500);
    sleep(Math.random() * 2);
  });

  group('Partner: Last Item Race', () => {
    // Multiple partners trying to order last item
    const limitedProductId = 'limited-edition-1';
    
    const res = http.post(`${BASE_URL}/partner/orders`, JSON.stringify({
      partnerId: `partner-${__VU}`,
      items: [{ productId: limitedProductId, quantity: 1 }],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(res, {
      'handled gracefully': (r) => [201, 400, 409].includes(r.status),
      'clear error message': (r) => {
        if (r.status === 400 || r.status === 409) {
          const body = JSON.parse(r.body);
          return body.error && body.error.length > 0;
        }
        return true;
      },
    });
    
    sleep(0.1); // Rapid fire
  });

  group('Partner: Payment Processing', () => {
    const orderId = `order-${__VU}-${Date.now()}`;
    
    // Simulate payment
    const res = http.post(`${BASE_URL}/partner/payments`, JSON.stringify({
      orderId,
      amount: Math.random() * 1000,
      currency: 'USD',
      paymentMethod: 'card',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    check(res, {
      'payment processed': (r) => [200, 201, 402].includes(r.status),
      'no duplicate charge': (r) => {
        // Check idempotency
        const secondRes = http.post(`${BASE_URL}/partner/payments`, JSON.stringify({
          orderId,
          amount: Math.random() * 1000,
          idempotencyKey: orderId,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
        return secondRes.status !== 201; // Should not create new payment
      },
    });
    
    if (res.status === 402 || res.status >= 500) {
      paymentFailures.add(1);
    }
    
    sleep(1);
  });
}

// ============================================
// CHAOS INJECTION SCENARIOS
// ============================================

export function chaosScenarios() {
  group('Chaos: Malformed Requests', () => {
    const malformedPayloads = [
      '{"broken json',
      'null',
      '[]',
      '{"__proto__": {"isAdmin": true}}',
      `{"field": "${'x'.repeat(10000)}"}`,
    ];
    
    malformedPayloads.forEach(payload => {
      const res = http.post(`${BASE_URL}/partner/orders`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      check(res, {
        'rejects malformed': (r) => r.status === 400 || r.status === 422,
        'no server error': (r) => r.status < 500,
        'no stack trace leak': (r) => !r.body.includes('at ') && !r.body.includes('.js:'),
      });
    });
  });

  group('Chaos: Timeout Simulation', () => {
    // Request that might timeout
    const res = http.get(`${BASE_URL}/partner/reports/full-catalog`, {
      timeout: '5s',
    });
    
    check(res, {
      'responds or times out gracefully': (r) => 
        r.status === 200 || r.status === 408 || r.status === 504,
    });
  });

  group('Chaos: Concurrent Session Attacks', () => {
    // Simulate session hijacking detection
    const sessions = [];
    
    // Login multiple times
    for (let i = 0; i < 5; i++) {
      const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        email: 'chaos-test@example.com',
        password: 'testpassword',
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.status === 200) {
        sessions.push(JSON.parse(res.body).token);
      }
    }
    
    // Use sessions from different "locations"
    sessions.forEach((token, i) => {
      const res = http.get(`${BASE_URL}/partner/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Forwarded-For': `192.168.1.${i * 10}`, // Different IPs
        },
      });
      
      check(res, {
        'session security': (r) => r.status === 200 || r.status === 401,
      });
    });
  });
}

// ============================================
// MAIN TEST FUNCTION
// ============================================

export default function() {
  const scenario = Math.random();
  
  if (scenario < 0.4) {
    adminScenarios();
  } else if (scenario < 0.8) {
    partnerScenarios();
  } else {
    chaosScenarios();
  }
}

// ============================================
// LIFECYCLE HOOKS
// ============================================

export function setup() {
  console.log('Setting up test data...');
  
  // Create test products
  http.post(`${BASE_URL}/admin/products`, JSON.stringify({
    id: 'popular-item-1',
    name: 'Popular Item 1',
    stock: 1000,
    price: 99.99,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  http.post(`${BASE_URL}/admin/products`, JSON.stringify({
    id: 'limited-edition-1',
    name: 'Limited Edition',
    stock: 10, // Low stock for race condition testing
    price: 999.99,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  return { startTime: Date.now() };
}

export function teardown(data) {
  console.log(`Test completed in ${Date.now() - data.startTime}ms`);
  console.log('Cleaning up test data...');
  
  // Cleanup test data
  http.del(`${BASE_URL}/admin/cleanup-test-data`);
}
