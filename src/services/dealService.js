import { supabase } from '../lib/supabase';
import { validateDeal, sanitizeString } from '../utils/validators';
import { logDataChange, AuditEventType } from './auditService';
import { notifyDealCreated, notifyDealStatusChanged, isEmailEnabled } from './emailService';

const convertToSnakeCase = (obj) => {
  return {
    name: sanitizeString(obj?.name),
    company: sanitizeString(obj?.company),
    value: obj?.value,
    stage: obj?.stage,
    partner_id: obj?.partnerId,
    probability: obj?.probability,
    close_date: obj?.closeDate,
    description: sanitizeString(obj?.description)
  };
};

const convertToCamelCase = (row) => {
  return {
    id: row?.id,
    name: row?.name,
    company: row?.company,
    value: row?.value,
    stage: row?.stage,
    partnerId: row?.partner_id,
    partner: row?.partner,
    probability: row?.probability,
    closeDate: row?.close_date,
    description: row?.description,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at
  };
};

export const dealService = {
  async getAll() {
    try {
      const { data, error } = await supabase?.from('deals')?.select('*')?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase?.from('deals')?.select('*')?.eq('id', id)?.single();

      if (error) throw error;
      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(deal) {
    try {
      // Validate input
      const validation = validateDeal(deal);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dealData = convertToSnakeCase(deal);
      dealData.created_by = user?.id;

      const { data, error } = await supabase?.from('deals')?.insert(dealData)?.select()?.single();

      if (error) throw error;

      // Log creation
      await logDataChange('deal', data?.id, 'create', null, dealData);

      // Send email notification (fire-and-forget)
      if (isEmailEnabled() && deal.assigneeEmail) {
        notifyDealCreated(data, deal.assigneeEmail).catch(console.error);
      }

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id, deal) {
    try {
      // Validate input
      const validation = validateDeal(deal);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const dealData = convertToSnakeCase(deal);

      // Get old data for audit
      const { data: oldData } = await supabase?.from('deals')?.select('*')?.eq('id', id)?.single();

      const { data, error } = await supabase?.from('deals')?.update(dealData)?.eq('id', id)?.select()?.single();

      if (error) throw error;

      // Log update
      await logDataChange('deal', id, 'update', oldData, dealData);

      // Notify on stage change (fire-and-forget)
      if (isEmailEnabled() && oldData?.stage !== data?.stage) {
        notifyDealStatusChanged(data, oldData?.stage || 'new', ['admin@distributorhub.com']).catch(console.error);
      }

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      // Get data for audit
      const { data: oldData } = await supabase?.from('deals')?.select('*')?.eq('id', id)?.single();

      const { error } = await supabase?.from('deals')?.delete()?.eq('id', id);

      if (error) throw error;

      // Log deletion
      await logDataChange('deal', id, 'delete', oldData, null);

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getByStage(stage) {
    try {
      const { data, error } = await supabase?.from('deals')?.select('*')?.eq('stage', stage)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};