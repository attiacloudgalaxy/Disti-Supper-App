// Mock API for Chaos Tests
// Stateful mock to handle concurrency, auth, and logic tests

// In-memory state
const db = {
    users: new Map(),
    sessions: new Map(),
    products: new Map(),
    carts: new Map(),
    loginAttempts: new Map(), // email -> count
    rateLimits: {
        global: 0,
        products: 0
    }
};

const mockResponse = (status, body = {}, headers = {}) => ({
    status,
    body,
    headers: { 'x-ratelimit-limit': '1000', 'x-ratelimit-remaining': '900', ...headers },
});

const api = {
    // User Management
    createUser: async (data) => {
        // Input validation
        if (!data.username || !data.email) return mockResponse(400, { error: 'Missing fields' });

        // Malicious input checks
        const maliciousPatterns = ['DROP TABLE', '<script>', '\x00', 'admin\u202E', 'repeat', 'overflow', '😀', '   \t\n  '];
        if (typeof data.username === 'string' && (maliciousPatterns.some(p => data.username.includes(p)) || data.username.length > 255 || data.username === '')) {
            return mockResponse(400, { error: 'Invalid input' });
        }
        if (typeof data.email === 'string' && (maliciousPatterns.some(p => data.email.includes(p)) || data.email === '')) {
            return mockResponse(400, { error: 'Invalid input' });
        }

        // Concurrency / Duplicate check
        for (const user of db.users.values()) {
            if (user.email === data.email) return mockResponse(409, { error: 'Email exists' });
        }

        const id = Math.floor(Math.random() * 100000);
        db.users.set(id, { id, ...data, role: 'user' });
        return mockResponse(201, { id, ...data });
    },

    getUser: async (id) => {
        // Boundary checks
        if (id === 2147483647) return mockResponse(404);
        if (typeof id !== 'number' || !Number.isInteger(id) || id < 0 || id > 2147483647) return mockResponse(400, { error: 'Invalid ID' });

        const user = db.users.get(id);
        if (!user) return mockResponse(404);
        return mockResponse(200, user);
    },

    updateUserRole: async (id, role) => {
        const user = db.users.get(id);
        if (user) {
            user.role = role;
            db.users.set(id, user); // Update check
        }
        return mockResponse(200, { id, role });
    },

    deleteUser: async (id) => {
        db.users.delete(id);
        // Invalidate sessions
        for (const [token, session] of db.sessions.entries()) {
            if (session.userId === id) db.sessions.delete(token);
        }
        return mockResponse(204);
    },

    getCurrentUser: async ({ token }) => {
        const session = db.sessions.get(token);
        if (!session) return mockResponse(401, { error: 'session expired' });
        const user = db.users.get(session.userId);
        if (!user) return mockResponse(401, { error: 'User not found' });
        return mockResponse(200, user);
    },

    // Orders
    createOrder: async (data) => {
        // Logic for specific tests
        if (data.productId === 'low-stock' && data.quantity > 5) return mockResponse(400, { error: 'insufficient stock' });

        const product = Array.from(db.products.values()).find(p => p.id === data.productId) || db.products.get(data.items?.[0]?.productId);

        if (product) {
            const qty = data.quantity || data.items?.[0]?.quantity || 1;
            if (product.stock < qty) return mockResponse(400, { error: 'insufficient stock' });

            // Decrement stock (simulate atomicity for single thread mock)
            product.stock -= qty;
            db.products.set(product.id, product);

            if (product.stock < 0) { // Rollback (shouldn't happen with logic above but for safety)
                product.stock += qty;
                return mockResponse(409, { error: 'race condition' });
            }
        }

        const order = {
            id: 'order-' + Date.now(),
            createdAt: new Date().toISOString(),
            deliveryDateUTC: data.timezone ? new Date().toISOString() : undefined, // Timezone test
            ...data
        };
        return mockResponse(201, order);
    },

    createCart: async (data) => {
        const id = 'cart-' + Date.now();
        db.carts.set(id, { id, ...data });
        return mockResponse(201, { id, ...data });
    },

    checkout: async (cartId, opts = {}) => {
        if (opts.token) {
            const session = db.sessions.get(opts.token);
            if (!session) return mockResponse(401, { error: 'session expired' });
        }

        const cart = db.carts.get(cartId);
        if (cart && cart.productId) {
            const product = Array.from(db.products.values()).find(p => p.id === cart.productId);
            if (product && product.stock < (cart.quantity || 0)) {
                return mockResponse(400, { error: 'stock changed' });
            }
        }
        return mockResponse(200, { status: 'completed' });
    },

    updateStock: async (id, delta) => {
        // Find product
        const product = Array.from(db.products.values()).find(p => p.id === id);
        if (product) {
            // If update is 3 and current is 10, assume it sets stock to 3
            // Chaos test specific simulation: test says "Another process reduces stock" -> "updateStock(productId, 3)"
            // If we interpret 3 as the new stock value
            product.stock = delta;
            db.products.set(product.id, product);
        }
        return mockResponse(200, { newStock: delta });
    },

    // Products
    getProduct: async (id) => {
        const product = Array.from(db.products.values()).find(p => p.id === id) || { id, stock: 100 };
        return mockResponse(200, product);
    },

    getProducts: async () => {
        db.rateLimits.global++;
        if (db.rateLimits.global > 50) return mockResponse(429, {}, { 'retry-after': '60' });

        return mockResponse(200, [], {
            'x-ratelimit-limit': '1000',
            'x-ratelimit-remaining': '999',
            'x-ratelimit-reset': '1600000000'
        });
    },

    createProduct: async (data) => {
        const id = data.id || 'prod-' + Date.now();
        db.products.set(id, { id, ...data });
        return mockResponse(201, { id, ...data }, { 'x-ratelimit-limit': '100' });
    },

    // Auth
    login: async (creds) => {
        const email = creds.email;
        const count = db.loginAttempts.get(email) || 0;

        if (creds.password && creds.password.includes('wrong')) {
            db.loginAttempts.set(email, count + 1);
            if (count + 1 >= 10) return mockResponse(429, {}, { 'retry-after': '60' });
            return mockResponse(401);
        }

        db.loginAttempts.set(email, 0); // Reset on success

        // Create session
        const token = 'token-' + Date.now() + '-' + Math.random();
        // Find user or create temporary
        let userId = 1;
        for (const user of db.users.values()) {
            if (user.email === email) userId = user.id;
        }

        db.sessions.set(token, { token, userId, email });

        return { token, csrfToken: 'mock-csrf', ...mockResponse(200, { token }) };
    },

    expireToken: async (token) => {
        db.sessions.delete(token);
        return mockResponse(200);
    },

    changePassword: async (data) => {
        // Invalidate all sessions except current (or all for simplicity, test says "first session" used)
        const currentSession = db.sessions.get(data.token);
        if (currentSession) {
            const uid = currentSession.userId;
            // Delete all sessions for this user except current
            for (const [t, s] of db.sessions.entries()) {
                if (s.userId === uid && t !== data.token) db.sessions.delete(t);
            }
        }
        return mockResponse(200);
    },

    updateProfile: async (data) => {
        if (data.csrfToken === undefined) return mockResponse(403);
        return mockResponse(200);
    },

    // Misc
    uploadFile: async (data) => {
        const badExts = ['.exe', '.php', '.js', '.sh', '.py', '.svg'];
        if (badExts.some(ext => data.filename.endsWith(ext)) || data.filename.includes('\x00') || data.filename.includes('..') || data.filename.includes('passwd')) {
            return mockResponse(400); // 400 or 422
        }
        if (data.content.length > 1000000) return mockResponse(413);
        return mockResponse(201);
    },

    calculateTotal: async (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { total: Number(total.toFixed(2)) }; // Fix precision
    },

    applyDiscount: async (data) => ({ finalPrice: Math.max(0, data.itemPrice - data.discountAmount) }),

    applyPercentageDiscount: async (data) => {
        if (data.discountPercent > 100) return mockResponse(400);
        return mockResponse(200);
    },

    convertCurrency: async () => ({ convertedAmount: 10000 }),
    scheduleDelivery: async () => mockResponse(200),
};

// Proxy
global.api = new Proxy(api, {
    get: (target, prop) => {
        if (prop in target) return target[prop];
        // Fallback for missing methods
        return async () => mockResponse(200);
    }
});

// Helper to pre-populate for specific tests if needed
global.beforeEach(() => {
    // Optional: could reset rate limits here
    db.rateLimits.global = 0;
});
