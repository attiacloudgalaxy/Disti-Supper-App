import { supabase } from '../lib/supabase';
import { notifyPartnerCreated, isEmailEnabled } from './emailService';

/**
 * Registration Service for Public Distributor Registration
 * Handles anonymous partner registration with duplicate detection
 */

// reCAPTCHA site key (v2 Invisible or v3)
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Check for duplicate partner by mandatory fields
 * @param {Object} data - Form data to check
 * @returns {Promise<{isDuplicate: boolean, field?: string, message?: string}>}
 */
export const checkDuplicatePartner = async ({ email, companyName, phone }) => {
    try {
        // Check by email (most common duplicate)
        const { data: emailMatch } = await supabase
            .from('partners')
            .select('id, company_name, email')
            .ilike('email', email.trim())
            .limit(1);

        if (emailMatch?.length > 0) {
            return {
                isDuplicate: true,
                field: 'email',
                message: `A partner with this email already exists: ${emailMatch[0].company_name}`
            };
        }

        // Check by company name (case-insensitive)
        const { data: companyMatch } = await supabase
            .from('partners')
            .select('id, company_name')
            .ilike('company_name', companyName.trim())
            .limit(1);

        if (companyMatch?.length > 0) {
            return {
                isDuplicate: true,
                field: 'companyName',
                message: `A partner with this company name already exists`
            };
        }

        // Check by phone (if provided and not empty)
        if (phone?.trim()) {
            // Normalize phone for comparison (remove spaces, dashes, parentheses)
            const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
            const { data: phoneMatch } = await supabase
                .from('partners')
                .select('id, company_name, phone')
                .not('phone', 'is', null);

            // Manual check for phone matches (with normalization)
            const matchingPhone = phoneMatch?.find(p =>
                p.phone?.replace(/[\s\-\(\)]/g, '') === normalizedPhone
            );

            if (matchingPhone) {
                return {
                    isDuplicate: true,
                    field: 'phone',
                    message: `A partner with this phone number already exists: ${matchingPhone.company_name}`
                };
            }
        }

        return { isDuplicate: false };
    } catch (error) {
        console.error('Duplicate check error:', error);
        // Don't block registration on duplicate check failure
        return { isDuplicate: false, error: error.message };
    }
};

/**
 * Verify reCAPTCHA token (server-side would be more secure, but for frontend demo)
 * In production, this should be verified server-side
 * @param {string} token - reCAPTCHA token
 * @returns {Promise<boolean>}
 */
export const verifyRecaptcha = async (token) => {
    if (!token) return false;

    // For client-side, we just check if token exists
    // In production, send to backend: POST to /api/verify-recaptcha
    // which then calls Google's siteverify API with the secret key
    return !!token;
};

/**
 * Generate a unique partner ID
 * @returns {string}
 */
const generatePartnerId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PTR-${year}-${random}`;
};

/**
 * Submit new partner registration
 * @param {Object} formData - Registration form data
 * @param {string} recaptchaToken - reCAPTCHA token
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const submitRegistration = async (formData, recaptchaToken) => {
    try {
        // Verify reCAPTCHA
        if (RECAPTCHA_SITE_KEY) {
            const isValidCaptcha = await verifyRecaptcha(recaptchaToken);
            if (!isValidCaptcha) {
                return { success: false, error: 'reCAPTCHA verification failed. Please try again.' };
            }
        }

        // Check for duplicates
        const duplicateCheck = await checkDuplicatePartner({
            email: formData.email,
            companyName: formData.companyName,
            phone: formData.phone
        });

        if (duplicateCheck.isDuplicate) {
            return {
                success: false,
                error: duplicateCheck.message,
                field: duplicateCheck.field
            };
        }

        // Prepare partner data with Pending status
        const partnerData = {
            partner_id: generatePartnerId(),
            company_name: formData.companyName?.trim(),
            contact_name: formData.contactName?.trim(),
            email: formData.email?.toLowerCase()?.trim(),
            phone: formData.phone?.trim(),
            website: formData.website?.trim() || null,
            tier: 'Bronze', // Default tier for new registrations
            region: formData.region,
            territory: formData.territory?.trim() || null,
            address: formData.address?.trim() || null,
            status: 'Pending', // Pending status for admin review
            member_since: new Date().toISOString().split('T')[0],
            performance_score: 0,
            revenue: 0,
            certifications: 0,
            active_deal_count: 0
        };

        // Insert into database (uses anonymous RLS policy)
        const { data, error } = await supabase
            .from('partners')
            .insert(partnerData)
            .select()
            .single();

        if (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Registration failed. Please try again later.' };
        }

        // Send email notification to admins (fire-and-forget)
        if (isEmailEnabled()) {
            notifyPartnerCreated(data, ['admin@distributorhub.com']).catch(console.error);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
};

/**
 * Check if reCAPTCHA is configured
 * @returns {boolean}
 */
export const isRecaptchaEnabled = () => !!RECAPTCHA_SITE_KEY;

/**
 * Get reCAPTCHA site key
 * @returns {string|null}
 */
export const getRecaptchaSiteKey = () => RECAPTCHA_SITE_KEY || null;
