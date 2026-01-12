/**
 * Input Validation Utilities
 * Provides validation functions for all data types used in the application
 */

// Email validation regex (RFC 5322 compliant simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (international format)
const PHONE_REGEX = /^[\d\s\-+()]{7,20}$/;

// URL validation
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

// XSS prevention - basic dangerous characters
const XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
];

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Raw input string
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
    if (typeof input !== 'string') return '';

    let sanitized = input.trim();

    // Remove dangerous patterns
    XSS_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });

    // Escape HTML entities
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

    return sanitized;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email is required' };
    }

    const trimmed = email.trim().toLowerCase();

    if (trimmed.length > 254) {
        return { isValid: false, error: 'Email is too long' };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validatePhone = (phone) => {
    if (!phone) {
        return { isValid: true }; // Phone is optional in most cases
    }

    if (typeof phone !== 'string') {
        return { isValid: false, error: 'Invalid phone format' };
    }

    if (!PHONE_REGEX.test(phone.trim())) {
        return { isValid: false, error: 'Invalid phone number format' };
    }

    return { isValid: true };
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateUrl = (url) => {
    if (!url) {
        return { isValid: true }; // URL is optional in most cases
    }

    if (typeof url !== 'string') {
        return { isValid: false, error: 'Invalid URL format' };
    }

    if (!URL_REGEX.test(url.trim())) {
        return { isValid: false, error: 'Invalid URL format' };
    }

    return { isValid: true };
};

/**
 * Validate numeric value within range
 * @param {number} value - Value to validate
 * @param {object} options - Validation options
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateNumber = (value, { min = -Infinity, max = Infinity, required = false } = {}) => {
    if (value === null || value === undefined || value === '') {
        if (required) {
            return { isValid: false, error: 'This field is required' };
        }
        return { isValid: true };
    }

    const num = Number(value);

    if (isNaN(num)) {
        return { isValid: false, error: 'Must be a valid number' };
    }

    if (num < min) {
        return { isValid: false, error: `Value must be at least ${min}` };
    }

    if (num > max) {
        return { isValid: false, error: `Value must be at most ${max}` };
    }

    return { isValid: true };
};

/**
 * Validate required string field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of field for error message
 * @param {object} options - Validation options
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateRequired = (value, fieldName = 'This field', { minLength = 1, maxLength = 1000 } = {}) => {
    if (!value || typeof value !== 'string') {
        return { isValid: false, error: `${fieldName} is required` };
    }

    const trimmed = value.trim();

    if (trimmed.length < minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    if (trimmed.length > maxLength) {
        return { isValid: false, error: `${fieldName} must be at most ${maxLength} characters` };
    }

    return { isValid: true };
};

/**
 * Validate partner data
 * @param {object} partner - Partner object to validate
 * @returns {{ isValid: boolean, errors: object }}
 */
export const validatePartner = (partner) => {
    const errors = {};

    const companyName = validateRequired(partner?.companyName, 'Company name');
    if (!companyName.isValid) errors.companyName = companyName.error;

    const contactName = validateRequired(partner?.contactName, 'Contact name');
    if (!contactName.isValid) errors.contactName = contactName.error;

    const email = validateEmail(partner?.email);
    if (!email.isValid) errors.email = email.error;

    const phone = validatePhone(partner?.phone);
    if (!phone.isValid) errors.phone = phone.error;

    const website = validateUrl(partner?.website);
    if (!website.isValid) errors.website = website.error;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate deal data
 * @param {object} deal - Deal object to validate
 * @returns {{ isValid: boolean, errors: object }}
 */
export const validateDeal = (deal) => {
    const errors = {};

    const name = validateRequired(deal?.name, 'Deal name');
    if (!name.isValid) errors.name = name.error;

    const company = validateRequired(deal?.company, 'Company');
    if (!company.isValid) errors.company = company.error;

    const value = validateNumber(deal?.value, { min: 0, required: true });
    if (!value.isValid) errors.value = value.error;

    const probability = validateNumber(deal?.probability, { min: 0, max: 100 });
    if (!probability.isValid) errors.probability = probability.error;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate quote data
 * @param {object} quote - Quote object to validate
 * @returns {{ isValid: boolean, errors: object }}
 */
export const validateQuote = (quote) => {
    const errors = {};

    const customerName = validateRequired(quote?.customerName, 'Customer name');
    if (!customerName.isValid) errors.customerName = customerName.error;

    const customerEmail = validateEmail(quote?.customerEmail);
    if (!customerEmail.isValid) errors.customerEmail = customerEmail.error;

    const discountPercent = validateNumber(quote?.discountPercent, { min: 0, max: 100 });
    if (!discountPercent.isValid) errors.discountPercent = discountPercent.error;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate product data
 * @param {object} product - Product object to validate
 * @returns {{ isValid: boolean, errors: object }}
 */
export const validateProduct = (product) => {
    const errors = {};

    const sku = validateRequired(product?.sku, 'SKU');
    if (!sku.isValid) errors.sku = sku.error;

    const name = validateRequired(product?.name, 'Product name');
    if (!name.isValid) errors.name = name.error;

    const manufacturer = validateRequired(product?.manufacturer, 'Manufacturer');
    if (!manufacturer.isValid) errors.manufacturer = manufacturer.error;

    const partnerPrice = validateNumber(product?.partnerPrice, { min: 0 });
    if (!partnerPrice.isValid) errors.partnerPrice = partnerPrice.error;

    const msrp = validateNumber(product?.msrp, { min: 0 });
    if (!msrp.isValid) errors.msrp = msrp.error;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate compliance requirement data
 * @param {object} requirement - Compliance requirement to validate
 * @returns {{ isValid: boolean, errors: object }}
 */
export const validateCompliance = (requirement) => {
    const errors = {};

    const req = validateRequired(requirement?.requirement, 'Requirement');
    if (!req.isValid) errors.requirement = req.error;

    const type = validateRequired(requirement?.type, 'Type');
    if (!type.isValid) errors.type = type.error;

    const responsible = validateRequired(requirement?.responsible, 'Responsible party');
    if (!responsible.isValid) errors.responsible = responsible.error;

    if (!requirement?.dueDate) {
        errors.dueDate = 'Due date is required';
    }

    const progress = validateNumber(requirement?.progress, { min: 0, max: 100 });
    if (!progress.isValid) errors.progress = progress.error;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
