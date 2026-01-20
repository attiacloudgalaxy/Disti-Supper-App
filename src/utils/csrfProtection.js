/**
 * CSRF Protection Utility
 * Generates and validates CSRF tokens for state-changing operations
 * 
 * Usage:
 * // Generate token
 * const token = csrfProtection.generateToken();
 * 
 * // Validate token
 * if (csrfProtection.validateToken(submittedToken)) {
 *   // Process request
 * }
 */

const TOKEN_KEY = 'csrf_token';
const TOKEN_EXPIRY_MS = 3600000; // 1 hour

class CSRFProtection {
    /**
     * Generate a random CSRF token
     * @returns {string} CSRF token
     */
    generateToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

        const tokenData = {
            value: token,
            timestamp: Date.now()
        };

        sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
        return token;
    }

    /**
     * Get the current CSRF token, or generate a new one if expired/missing
     * @returns {string} CSRF token
     */
    getToken() {
        const stored = sessionStorage.getItem(TOKEN_KEY);

        if (!stored) {
            return this.generateToken();
        }

        try {
            const tokenData = JSON.parse(stored);
            const age = Date.now() - tokenData.timestamp;

            // Regenerate if expired
            if (age > TOKEN_EXPIRY_MS) {
                return this.generateToken();
            }

            return tokenData.value;
        } catch (e) {
            return this.generateToken();
        }
    }

    /**
     * Validate a submitted CSRF token
     * @param {string} submittedToken - The token to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateToken(submittedToken) {
        if (!submittedToken) return false;

        const stored = sessionStorage.getItem(TOKEN_KEY);
        if (!stored) return false;

        try {
            const tokenData = JSON.parse(stored);
            const age = Date.now() - tokenData.timestamp;

            // Check expiry
            if (age > TOKEN_EXPIRY_MS) {
                return false;
            }

            // Constant-time comparison to prevent timing attacks
            return this.constantTimeCompare(submittedToken, tokenData.value);
        } catch (e) {
            return false;
        }
    }

    /**
     * Constant-time string comparison to prevent timing attacks
     * @param {string} a - First string
     * @param {string} b - Second string
     * @returns {boolean} True if equal
     */
    constantTimeCompare(a, b) {
        if (a.length !== b.length) return false;

        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }

        return result === 0;
    }

    /**
     * Clear the stored CSRF token
     */
    clearToken() {
        sessionStorage.removeItem(TOKEN_KEY);
    }

    /**
     * Refresh the CSRF token (generate new one)
     * @returns {string} New CSRF token
     */
    refreshToken() {
        this.clearToken();
        return this.generateToken();
    }
}

// Export singleton instance
export const csrfProtection = new CSRFProtection();

/**
 * React Hook for CSRF protection
 * @returns {Object} { token, refreshToken }
 */
export const useCSRFProtection = () => {
    const token = csrfProtection.getToken();

    return {
        token,
        refreshToken: () => csrfProtection.refreshToken(),
        validateToken: (submittedToken) => csrfProtection.validateToken(submittedToken)
    };
};

export default csrfProtection;
