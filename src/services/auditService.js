/**
 * Audit Logging Service
 * Tracks security-relevant events for SOC 2 compliance
 * 
 * Events logged:
 * - Authentication (login, logout, failed attempts)
 * - Data access (read sensitive data)
 * - Data modifications (create, update, delete)
 * - Permission changes
 */

import { supabase } from '../lib/supabase';

// Audit event types
export const AuditEventType = {
    // Authentication events
    AUTH_LOGIN_SUCCESS: 'auth.login.success',
    AUTH_LOGIN_FAILURE: 'auth.login.failure',
    AUTH_LOGOUT: 'auth.logout',
    AUTH_PASSWORD_RESET: 'auth.password.reset',

    // Data events
    DATA_CREATE: 'data.create',
    DATA_READ: 'data.read',
    DATA_UPDATE: 'data.update',
    DATA_DELETE: 'data.delete',
    DATA_EXPORT: 'data.export',

    // Permission events
    PERMISSION_GRANTED: 'permission.granted',
    PERMISSION_REVOKED: 'permission.revoked',

    // Security events
    SECURITY_SUSPICIOUS: 'security.suspicious',
    SECURITY_RATE_LIMIT: 'security.rate_limit'
};

// Severity levels
export const AuditSeverity = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical'
};

/**
 * Create an audit log entry
 * @param {object} params - Audit log parameters
 * @returns {Promise<{data: object|null, error: Error|null}>}
 */
export const createAuditLog = async ({
    eventType,
    entityType,
    entityId = null,
    action,
    details = {},
    severity = AuditSeverity.INFO,
    userId = null,
    ipAddress = null,
    userAgent = null
}) => {
    try {
        // Get current user if not provided
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const { data: { user } } = await supabase?.auth?.getUser();
            effectiveUserId = user?.id;
        }

        const auditEntry = {
            event_type: eventType,
            entity_type: entityType,
            entity_id: entityId,
            action: action,
            details: JSON.stringify(details),
            severity: severity,
            user_id: effectiveUserId,
            ip_address: ipAddress,
            user_agent: userAgent || (typeof navigator !== 'undefined' ? navigator?.userAgent : null),
            created_at: new Date().toISOString()
        };

        // Try to insert into audit_logs table
        // Note: This table needs to be created in Supabase
        const { data, error } = await supabase
            ?.from('audit_logs')
            ?.insert(auditEntry)
            ?.select()
            ?.single();

        if (error) {
            // If table doesn't exist, log to console in development
            if (error?.code === '42P01' || error?.code === 'PGRST205') {
                console.warn('[Audit] audit_logs table not found. Log entry:', auditEntry);
                return { data: auditEntry, error: null };
            }
            throw error;
        }

        return { data, error: null };
    } catch (error) {
        // Don't throw - audit logging should not break the app
        console.error('[Audit] Failed to create audit log:', error);
        return { data: null, error };
    }
};

/**
 * Log a data modification event
 */
export const logDataChange = async (entityType, entityId, action, oldData = null, newData = null) => {
    return createAuditLog({
        eventType: `data.${action.toLowerCase()}`,
        entityType,
        entityId,
        action,
        details: {
            oldData: oldData ? { ...oldData, password: undefined } : null,
            newData: newData ? { ...newData, password: undefined } : null,
            changedFields: oldData && newData
                ? Object.keys(newData).filter(key => oldData[key] !== newData[key])
                : null
        },
        severity: action === 'delete' ? AuditSeverity.WARNING : AuditSeverity.INFO
    });
};

/**
 * Log an authentication event
 */
export const logAuthEvent = async (eventType, email, success, details = {}) => {
    return createAuditLog({
        eventType,
        entityType: 'user',
        action: eventType.split('.').pop(),
        details: {
            email,
            success,
            ...details
        },
        severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING
    });
};

/**
 * Log a security event
 */
export const logSecurityEvent = async (eventType, details, severity = AuditSeverity.WARNING) => {
    return createAuditLog({
        eventType,
        entityType: 'security',
        action: eventType.split('.').pop(),
        details,
        severity
    });
};

export const auditService = {
    createAuditLog,
    logDataChange,
    logAuthEvent,
    logSecurityEvent,
    AuditEventType,
    AuditSeverity
};

export default auditService;
