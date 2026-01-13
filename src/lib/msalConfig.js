import { PublicClientApplication } from '@azure/msal-browser';

/**
 * MSAL Configuration for Azure AD (Entra ID) Authentication
 * 
 * Required Environment Variables:
 * - VITE_AZURE_CLIENT_ID: Application (client) ID from Azure App Registration
 * - VITE_AZURE_TENANT_ID: Directory (tenant) ID from Azure (use 'common' for multi-tenant)
 */

// Get the base path for redirects (handles GitHub Pages subdirectory)
const getBaseUrl = () => {
    if (typeof window === 'undefined') return '/';
    const basePath = import.meta.env.BASE_URL || '/';
    return window.location.origin + basePath;
};

const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'common'}`,
        // Use base URL with trailing slash removed for redirect
        redirectUri: getBaseUrl().replace(/\/$/, ''),
        postLogoutRedirectUri: getBaseUrl().replace(/\/$/, ''),
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                if (import.meta.env.DEV) {
                    console.log(`[MSAL] ${message}`);
                }
            },
        },
    },
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Login request scopes
export const loginRequest = {
    scopes: ['User.Read', 'openid', 'profile', 'email'],
};

// Check if MSAL is configured
export const isMsalConfigured = () => {
    return !!import.meta.env.VITE_AZURE_CLIENT_ID;
};
