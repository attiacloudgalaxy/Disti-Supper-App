/**
 * Security Headers Configuration
 * Configure Content Security Policy and other security headers
 * Reference: https://owasp.org/www-project-secure-headers/
 */

// Content Security Policy directives
export const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com", "data:"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': [
        "'self'",
        "https://*.supabase.co",
        "wss://*.supabase.co",
        "https://api.openai.com",
        "https://generativelanguage.googleapis.com"
    ],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"]
};

// Convert CSP object to header string
export const buildCspHeader = (directives = cspDirectives) => {
    return Object.entries(directives)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');
};

// Security headers for production
export const securityHeaders = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Enable XSS filter (legacy browsers)
    'X-XSS-Protection': '1; mode=block',

    // Require HTTPS (enable in production)
    // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

    // Prevent information leakage
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Control browser features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

    // Content Security Policy
    'Content-Security-Policy': buildCspHeader()
};

// Headers safe for development (more permissive)
export const devSecurityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
};

/**
 * Get security headers based on environment
 * @param {boolean} isDev - Whether in development mode
 * @returns {object} Security headers object
 */
export const getSecurityHeaders = (isDev = false) => {
    return isDev ? devSecurityHeaders : securityHeaders;
};

export default {
    cspDirectives,
    buildCspHeader,
    securityHeaders,
    devSecurityHeaders,
    getSecurityHeaders
};
