import { supabase } from '../lib/supabase';
import { validatePartner, sanitizeString } from '../utils/validators';
import { logDataChange, AuditEventType } from './auditService';
import { notifyPartnerCreated, notifyPartnerStatusChanged, isEmailEnabled } from './emailService';

const convertToSnakeCase = (obj) => {
  return {
    partner_id: obj?.partnerId,
    company_name: sanitizeString(obj?.companyName),
    logo: obj?.logo,
    logo_alt: obj?.logoAlt,
    contact_name: sanitizeString(obj?.contactName),
    email: obj?.email?.toLowerCase()?.trim(),
    phone: obj?.phone,
    website: obj?.website,
    tier: obj?.tier,
    region: obj?.region,
    territory: obj?.territory,
    address: sanitizeString(obj?.address),
    performance_score: obj?.performanceScore,
    revenue: obj?.revenue,
    certifications: obj?.certifications,
    active_deal_count: obj?.activeDealCount,
    status: obj?.status,
    member_since: obj?.memberSince,
    last_activity: obj?.lastActivity
  };
};

const convertToCamelCase = (row) => {
  return {
    id: row?.id,
    partnerId: row?.partner_id,
    companyName: row?.company_name,
    logo: row?.logo,
    logoAlt: row?.logo_alt,
    contactName: row?.contact_name,
    email: row?.email,
    phone: row?.phone,
    website: row?.website,
    tier: row?.tier,
    region: row?.region,
    territory: row?.territory,
    address: row?.address,
    performanceScore: row?.performance_score,
    revenue: row?.revenue,
    certifications: row?.certifications,
    activeDealCount: row?.active_deal_count,
    status: row?.status,
    memberSince: row?.member_since,
    lastActivity: row?.last_activity,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at
  };
};

export const partnerService = {
  async getAll() {
    try {
      const { data, error } = await supabase?.from('partners')?.select('*')?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase?.from('partners')?.select('*')?.eq('id', id)?.single();

      if (error) throw error;
      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(partner) {
    try {
      // Validate input before processing
      const validation = validatePartner(partner);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const partnerData = convertToSnakeCase(partner);
      partnerData.created_by = user?.id;

      const { data, error } = await supabase?.from('partners')?.insert(partnerData)?.select()?.single();

      if (error) throw error;

      // Log the creation for audit trail
      await logDataChange('partner', data?.id, 'create', null, partnerData);

      // Send email notification to admins (fire-and-forget)
      if (isEmailEnabled()) {
        notifyPartnerCreated(data, ['admin@distributorhub.com']).catch(console.error);
      }

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id, partner) {
    try {
      // Validate input before processing
      const validation = validatePartner(partner);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const partnerData = convertToSnakeCase(partner);

      // Get old data for audit log comparison
      const { data: oldData } = await supabase?.from('partners')?.select('*')?.eq('id', id)?.single();

      const { data, error } = await supabase?.from('partners')?.update(partnerData)?.eq('id', id)?.select()?.single();

      if (error) throw error;

      // Log the update
      await logDataChange('partner', id, 'update', oldData, partnerData);

      // Send email notification if status changed (fire-and-forget)
      if (isEmailEnabled() && oldData?.status !== data?.status) {
        notifyPartnerStatusChanged(data, oldData?.status || 'unknown', ['admin@distributorhub.com']).catch(console.error);
      }

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      // Get data before deletion for audit log
      const { data: oldData } = await supabase?.from('partners')?.select('*')?.eq('id', id)?.single();

      const { error } = await supabase?.from('partners')?.delete()?.eq('id', id);

      if (error) throw error;

      // Log the deletion
      await logDataChange('partner', id, 'delete', oldData, null);

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getCertifications(partnerId) {
    try {
      const { data, error } = await supabase?.from('partner_certifications')?.select('*')?.eq('partner_id', partnerId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};