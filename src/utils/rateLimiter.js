/**
 * Client-side Rate Limiting Utility
 * Prevents abuse by limiting the number of requests per time window
 * 
 * Usage:
 * const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
 * if (limiter.check('api-call')) {
 *   // Proceed with request
 * } else {
 *   // Show error: too many requests
 * }
 */

class RateLimiter {
    constructor({ maxRequests = 10, windowMs = 60000, keyPrefix = 'rate_limit' }) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.keyPrefix = keyPrefix;
    }

    /**
     * Get the storage key for a specific action
     * @param {string} action - The action being rate limited
     * @returns {string} Storage key
     */
    getKey(action) {
        return `${this.keyPrefix}_${action}`;
    }

    /**
     * Get current request count and timestamps for an action
     * @param {string} action - The action being checked
     * @returns {Array<number>} Array of timestamps
     */
    getRequests(action) {
        const key = this.getKey(action);
        const data = localStorage.getItem(key);
        if (!data) return [];

        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    /**
     * Save request timestamps for an action
     * @param {string} action - The action being saved
     * @param {Array<number>} requests - Array of timestamps
     */
    saveRequests(action, requests) {
        const key = this.getKey(action);
        localStorage.setItem(key, JSON.stringify(requests));
    }

    /**
     * Check if an action is allowed under rate limit
     * @param {string} action - The action being checked
     * @returns {boolean} True if allowed, false if rate limited
     */
    check(action) {
        const now = Date.now();
        const requests = this.getRequests(action);

        // Filter out requests outside the current window
        const windowStart = now - this.windowMs;
        const recentRequests = requests.filter(timestamp => timestamp > windowStart);

        // Check if limit exceeded
        if (recentRequests.length >= this.maxRequests) {
            return false;
        }

        // Add current request and save
        recentRequests.push(now);
        this.saveRequests(action, recentRequests);

        return true;
    }

    /**
     * Get remaining requests in current window
     * @param {string} action - The action being checked
     * @returns {number} Number of remaining requests
     */
    getRemaining(action) {
        const now = Date.now();
        const requests = this.getRequests(action);
        const windowStart = now - this.windowMs;
        const recentRequests = requests.filter(timestamp => timestamp > windowStart);

        return Math.max(0, this.maxRequests - recentRequests.length);
    }

    /**
     * Get time until rate limit reset (in milliseconds)
     * @param {string} action - The action being checked
     * @returns {number} Milliseconds until reset
     */
    getResetTime(action) {
        const requests = this.getRequests(action);
        if (requests.length === 0) return 0;

        const oldestRequest = Math.min(...requests);
        const resetTime = oldestRequest + this.windowMs;
        const now = Date.now();

        return Math.max(0, resetTime - now);
    }

    /**
     * Clear rate limit for an action
     * @param {string} action - The action to reset
     */
    reset(action) {
        const key = this.getKey(action);
        localStorage.removeItem(key);
    }

    /**
     * Clear all rate limits
     */
    resetAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.keyPrefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Pre-configured rate limiters for common use cases
export const apiRateLimiter = new RateLimiter({
    maxRequests: 30,
    windowMs: 60000, // 30 requests per minute
    keyPrefix: 'api_limit'
});

export const authRateLimiter = new RateLimiter({
    maxRequests: 5,
    windowMs: 300000, // 5 attempts per 5 minutes
    keyPrefix: 'auth_limit'
});

export const formSubmitLimiter = new RateLimiter({
    maxRequests: 3,
    windowMs: 60000, // 3 submissions per minute
    keyPrefix: 'form_limit'
});

export default RateLimiter;
