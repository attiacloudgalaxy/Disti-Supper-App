/**
 * Distribution Company - Edge Case Test Suite
 * Tests for "every weird single box that may create a bug"
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

// Define global mock API and test data to satisfy TypeScript
declare const api: any;

const validOrderData = {
  partnerId: 'partner-1',
  items: [{ productId: 'prod-1', quantity: 1 }],
  total: 100
};

const validCredentials = {
  email: 'test@example.com',
  password: 'password123'
};

const cartData = {
  items: [{ productId: 'prod-1', quantity: 1 }]
};

const productData = {
  name: 'Test Product',
  price: 100,
  stock: 10
};

// Extend Jest matchers interface
interface CustomMatchers<R = unknown> {
  toBeOneOf(expected: any[]): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers { }
    interface Matchers<R> extends CustomMatchers<R> { }
    interface InverseAsymmetricMatchers extends CustomMatchers { }
  }
}

// ============================================
// ADMIN TEST SCENARIOS
// ============================================

describe('Admin: User Management Edge Cases', () => {

  describe('Input Validation Chaos', () => {
    const maliciousInputs = [
      { name: 'SQL Injection', value: "'; DROP TABLE users; --" },
      { name: 'XSS Attack', value: '<script>alert("xss")</script>' },
      { name: 'Unicode Overflow', value: '𝕳𝖊𝖑𝖑𝖔'.repeat(1000) },
      { name: 'Null Bytes', value: 'test\x00hidden' },
      { name: 'RTL Override', value: 'admin\u202Emanager' },
      { name: 'Zero Width Chars', value: 'admin\u200Btest' },
      { name: 'Emoji Overflow', value: '😀'.repeat(10000) },
      { name: 'Max Length + 1', value: 'a'.repeat(256) },
      { name: 'Only Whitespace', value: '   \t\n  ' },
      { name: 'Empty String', value: '' },
      { name: 'Null Value', value: null },
      { name: 'Undefined', value: undefined },
    ];

    maliciousInputs.forEach(({ name, value }) => {
      test(`handles ${name} in username field`, async () => {
        const response = await api.createUser({ username: value });
        (expect(response.status) as any).toBeOneOf([400, 422]); // Should reject
        expect(response.body).not.toContain('error'); // No stack trace leak
      });

      test(`handles ${name} in email field`, async () => {
        const response = await api.createUser({ email: value });
        (expect(response.status) as any).toBeOneOf([400, 422]);
      });
    });
  });

  describe('Boundary Conditions', () => {
    test('user ID at INT_MAX boundary', async () => {
      const response = await api.getUser(2147483647);
      expect(response.status).toBe(404);
    });

    test('user ID at INT_MAX + 1 (overflow)', async () => {
      const response = await api.getUser(2147483648);
      expect(response.status).toBe(400);
    });

    test('negative user ID', async () => {
      const response = await api.getUser(-1);
      expect(response.status).toBe(400);
    });

    test('user ID as float', async () => {
      const response = await api.getUser(1.5);
      expect(response.status).toBe(400);
    });

    test('user ID as string', async () => {
      const response = await api.getUser('abc');
      expect(response.status).toBe(400);
    });
  });

  describe('Concurrency Chaos', () => {
    test('simultaneous user creation with same email', async () => {
      const email = `test-${Date.now()}@example.com`;
      const requests = Array(10).fill(null).map(() =>
        api.createUser({ email, username: `user-${Math.random()}` })
      );

      const results = await Promise.all(requests);
      const successes = results.filter(r => r.status === 201);
      const conflicts = results.filter(r => r.status === 409);

      expect(successes.length).toBe(1); // Only one should succeed
      expect(conflicts.length).toBe(9);
    });

    test('rapid role changes on same user', async () => {
      const user = await createTestUser();
      const roles = ['admin', 'user', 'admin', 'moderator', 'user'];

      await Promise.all(roles.map(role =>
        api.updateUserRole(user.id, role)
      ));

      const updatedUser = await api.getUser(user.id);
      expect(roles).toContain(updatedUser.body.role); // Should be one valid role
    });

    test('delete user during active session', async () => {
      const { userId, sessionToken } = await createUserWithSession();

      // Admin deletes user while session active
      await api.deleteUser(userId);

      // User's session should be invalidated
      const response = await api.getCurrentUser({ token: sessionToken });
      expect(response.status).toBe(401);
    });
  });
});

// ============================================
// PARTNER TEST SCENARIOS
// ============================================

describe('Partner: Order Processing Edge Cases', () => {

  describe('Inventory Race Conditions', () => {
    test('two partners claim last item simultaneously', async () => {
      const productId = await createProductWithStock(1);

      const [order1, order2] = await Promise.all([
        api.createOrder({ partnerId: 'partner1', productId, quantity: 1 }),
        api.createOrder({ partnerId: 'partner2', productId, quantity: 1 }),
      ]);

      const successes = [order1, order2].filter(o => o.status === 201);
      expect(successes.length).toBe(1); // Only one should succeed

      const product = await api.getProduct(productId);
      expect(product.body.stock).toBe(0);
      expect(product.body.stock).not.toBeLessThan(0); // Never negative
    });

    test('order quantity exceeds available stock', async () => {
      const productId = await createProductWithStock(5);

      const response = await api.createOrder({
        partnerId: 'partner1',
        productId,
        quantity: 10,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('insufficient stock');
    });

    test('stock update during checkout', async () => {
      const productId = await createProductWithStock(10);

      // Start checkout
      const cart = await api.createCart({ productId, quantity: 5 });

      // Another process reduces stock
      await api.updateStock(productId, 3);

      // Complete checkout
      const response = await api.checkout(cart.body.id);
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('stock changed');
    });
  });

  describe('Price Calculation Edge Cases', () => {
    test('floating point precision in totals', async () => {
      // Classic 0.1 + 0.2 !== 0.3 problem
      const items = [
        { price: 0.1, quantity: 1 },
        { price: 0.2, quantity: 1 },
      ];

      const response = await api.calculateTotal(items);
      expect(response.total).toBe(0.30); // Should handle precision
      expect(response.total).not.toBe(0.30000000000000004);
    });

    test('negative discount exceeds item price', async () => {
      const response = await api.applyDiscount({
        itemPrice: 10.00,
        discountAmount: 15.00,
      });

      expect(response.finalPrice).toBe(0); // Never negative
    });

    test('percentage discount > 100%', async () => {
      const response = await api.applyPercentageDiscount({
        itemPrice: 100.00,
        discountPercent: 150,
      });

      expect(response.status).toBe(400);
    });

    test('currency conversion rounding', async () => {
      const response = await api.convertCurrency({
        amount: 99.99,
        from: 'USD',
        to: 'JPY', // No decimal places
      });

      expect(Number.isInteger(response.convertedAmount)).toBe(true);
    });
  });

  describe('Date/Time Edge Cases', () => {
    test('order placed on Feb 29 leap year', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-02-29T23:59:59Z'));

      const response = await api.createOrder(validOrderData);
      expect(response.status).toBe(201);
      expect(response.body.createdAt).toContain('2024-02-29');

      jest.useRealTimers();
    });

    test('order processing across timezone boundaries', async () => {
      // Order placed at 11:59 PM EST
      const order = await api.createOrder({
        ...validOrderData,
        timezone: 'America/New_York',
        deliveryDate: '2026-01-15',
      });

      // System processes in UTC
      expect(order.body.deliveryDateUTC).toBeDefined();
    });

    test('year 2038 problem (32-bit timestamp)', async () => {
      const futureDate = new Date('2040-01-01');

      const response = await api.scheduleDelivery({
        orderId: 'test-order',
        date: futureDate.toISOString(),
      });

      expect(response.status).not.toBe(500);
    });
  });
});

// ============================================
// AUTHENTICATION CHAOS
// ============================================

describe('Authentication & Session Edge Cases', () => {

  test('token expires mid-checkout', async () => {
    const { token } = await api.login(validCredentials);

    // Start checkout
    const cart = await api.createCart(cartData, { token });

    // Expire the token
    await api.expireToken(token);

    // Try to complete checkout
    const response = await api.checkout(cart.id, { token });

    expect(response.status).toBe(401);
    expect(response.body.error).toContain('session expired');
    // Cart should be preserved for re-authentication
  });

  test('password change invalidates all sessions', async () => {
    const user = await createTestUser();
    const sessions = await Promise.all([
      api.login({ email: user.email, password: user.password }),
      api.login({ email: user.email, password: user.password }),
      api.login({ email: user.email, password: user.password }),
    ]);

    // Change password using first session
    await api.changePassword({
      token: sessions[0].token,
      newPassword: 'NewP@ssw0rd!',
    });

    // All other sessions should be invalid
    for (const session of sessions.slice(1)) {
      const response = await api.getCurrentUser({ token: session.token });
      expect(response.status).toBe(401);
    }
  });

  test('brute force protection triggers', async () => {
    const responses = [];

    for (let i = 0; i < 15; i++) {
      responses.push(await api.login({
        email: 'test@example.com',
        password: `wrong-password-${i}`,
      }));
    }

    const lastResponse = responses[responses.length - 1];
    expect(lastResponse.status).toBe(429); // Rate limited
    expect(lastResponse.headers['retry-after']).toBeDefined();
  });

  test('CSRF token validation', async () => {
    const { token, csrfToken } = await api.login(validCredentials);

    // Try action without CSRF token
    const response = await api.updateProfile({
      token,
      csrfToken: undefined,
      data: { name: 'Hacker' },
    });

    expect(response.status).toBe(403);
  });
});

// ============================================
// FILE UPLOAD CHAOS
// ============================================

describe('File Upload Edge Cases', () => {

  test('upload file with malicious extension', async () => {
    const maliciousFiles = [
      'image.jpg.exe',
      'document.pdf.php',
      'file.png.js',
      '../../../etc/passwd',
      'test.svg', // Can contain scripts
    ];

    for (const filename of maliciousFiles) {
      const response = await api.uploadFile({
        filename,
        content: Buffer.from('malicious content'),
      });
      (expect(response.status) as any).toBeOneOf([400, 422]);
    }
  });

  test('upload exceeds max size', async () => {
    const largeFile = Buffer.alloc(100 * 1024 * 1024); // 100MB

    const response = await api.uploadFile({
      filename: 'large-file.pdf',
      content: largeFile,
    });

    expect(response.status).toBe(413); // Payload too large
  });

  test('upload file with null bytes in name', async () => {
    const response = await api.uploadFile({
      filename: 'innocent.jpg\x00.exe',
      content: Buffer.from('test'),
    });

    expect(response.status).toBe(400);
  });

  test('concurrent uploads same filename', async () => {
    const filename = `test-${Date.now()}.jpg`;

    const uploads = Array(5).fill(null).map((_, i) =>
      api.uploadFile({
        filename,
        content: Buffer.from(`content-${i}`),
      })
    );

    const results = await Promise.all(uploads);
    // Should handle gracefully - rename or reject duplicates
    const successes = results.filter(r => r.status === 201);
    expect(successes.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================
// API RATE LIMITING CHAOS
// ============================================

describe('API Rate Limiting Edge Cases', () => {

  test('burst requests hit rate limit', async () => {
    const requests = Array(100).fill(null).map(() =>
      api.getProducts()
    );

    const results = await Promise.all(requests);
    const rateLimited = results.filter(r => r.status === 429);

    expect(rateLimited.length).toBeGreaterThan(0);
  });

  test('rate limit headers present', async () => {
    const response = await api.getProducts();

    expect(response.headers['x-ratelimit-limit']).toBeDefined();
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    expect(response.headers['x-ratelimit-reset']).toBeDefined();
  });

  test('different rate limits per endpoint', async () => {
    // Read endpoints should have higher limits
    const readResponse = await api.getProducts();
    const writeResponse = await api.createProduct(productData);

    const readLimit = parseInt(readResponse.headers['x-ratelimit-limit']);
    const writeLimit = parseInt(writeResponse.headers['x-ratelimit-limit']);

    expect(readLimit).toBeGreaterThan(writeLimit);
  });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function createTestUser() {
  const response = await api.createUser({
    email: `test-${Date.now()}-${Math.random()}@example.com`, // Unique!
    username: `testuser-${Date.now()}-${Math.random()}`,
    password: 'TestP@ssw0rd!',
  });
  if (response.status !== 201) {
    throw new Error(`Failed to create test user: ${response.status} ${JSON.stringify(response.body)}`);
  }
  return response.body;
}

async function createProductWithStock(stock: number) {
  const response = await api.createProduct({
    name: `Test Product ${Date.now()}`,
    price: 99.99,
    stock,
  });
  return response.body.id;
}

async function createUserWithSession() {
  const user = await createTestUser();
  const session = await api.login({
    email: user.email,
    password: 'TestP@ssw0rd!',
  });
  return { userId: user.id, sessionToken: session.token };
}

// Custom Jest matchers
expect.extend({
  toBeOneOf(received, array) {
    const pass = array.includes(received);
    return {
      pass,
      message: () =>
        `expected ${received} to be one of ${array.join(', ')}`,
    };
  },
});
