import { supabase } from '../lib/supabase';
import { validateQuote, sanitizeString } from '../utils/validators';
import { logDataChange, AuditEventType } from './auditService';
import { notifyQuoteCreated, isEmailEnabled } from './emailService';

const convertToSnakeCase = (obj) => {
  return {
    quote_number: obj?.quoteNumber,
    partner_id: obj?.partnerId,
    customer_name: sanitizeString(obj?.customerName),
    customer_email: obj?.customerEmail,
    subtotal: obj?.subtotal,
    discount_percent: obj?.discountPercent,
    discount_amount: obj?.discountAmount,
    tax_amount: obj?.taxAmount,
    total: obj?.total,
    payment_terms: obj?.paymentTerms,
    delivery_method: obj?.deliveryMethod,
    include_warranty: obj?.includeWarranty,
    include_support: obj?.includeSupport,
    validity_days: obj?.validityDays,
    status: obj?.status
  };
};

const convertToCamelCase = (row) => {
  return {
    id: row?.id,
    quoteNumber: row?.quote_number,
    partnerId: row?.partner_id,
    customerName: row?.customer_name,
    customerEmail: row?.customer_email,
    subtotal: row?.subtotal,
    discountPercent: row?.discount_percent,
    discountAmount: row?.discount_amount,
    taxAmount: row?.tax_amount,
    total: row?.total,
    paymentTerms: row?.payment_terms,
    deliveryMethod: row?.delivery_method,
    includeWarranty: row?.include_warranty,
    includeSupport: row?.include_support,
    validityDays: row?.validity_days,
    status: row?.status,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at
  };
};

export const quoteService = {
  async getAll() {
    try {
      const { data, error } = await supabase?.from('quotes')?.select('*')?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase?.from('quotes')?.select('*, quote_items(*)')?.eq('id', id)?.single();

      if (error) throw error;
      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(quote) {
    try {
      // Validate input
      const validation = validateQuote(quote);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const quoteData = convertToSnakeCase(quote);
      quoteData.created_by = user?.id;

      const { data, error } = await supabase?.from('quotes')?.insert(quoteData)?.select()?.single();

      if (error) throw error;

      // Log creation
      await logDataChange('quote', data?.id, 'create', null, quoteData);

      // Send email notification (fire-and-forget)
      if (isEmailEnabled() && quote.customerEmail) {
        notifyQuoteCreated(data, quote.customerEmail).catch(console.error);
      }

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id, quote) {
    try {
      // Validate input
      const validation = validateQuote(quote);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const quoteData = convertToSnakeCase(quote);

      // Get old data for audit
      const { data: oldData } = await supabase?.from('quotes')?.select('*')?.eq('id', id)?.single();

      const { data, error } = await supabase?.from('quotes')?.update(quoteData)?.eq('id', id)?.select()?.single();

      if (error) throw error;

      // Log update
      await logDataChange('quote', id, 'update', oldData, quoteData);

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      // Get data for audit
      const { data: oldData } = await supabase?.from('quotes')?.select('*')?.eq('id', id)?.single();

      const { error } = await supabase?.from('quotes')?.delete()?.eq('id', id);

      if (error) throw error;

      // Log deletion
      await logDataChange('quote', id, 'delete', oldData, null);

      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};