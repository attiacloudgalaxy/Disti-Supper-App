import { supabase } from '../lib/supabase';
import { validateProduct, sanitizeString } from '../utils/validators';
import { logDataChange, AuditEventType } from './auditService';
import { notifyLowStock, isEmailEnabled } from './emailService';

const convertToSnakeCase = (obj) => {
  return {
    sku: sanitizeString(obj?.sku),
    name: sanitizeString(obj?.name),
    manufacturer: sanitizeString(obj?.manufacturer),
    category: obj?.category,
    available: obj?.available,
    allocated: obj?.allocated,
    low_stock_threshold: obj?.lowStockThreshold,
    location: sanitizeString(obj?.location),
    partner_price: obj?.partnerPrice,
    msrp: obj?.msrp,
    description: sanitizeString(obj?.description)
  };
};

const convertToCamelCase = (row) => {
  return {
    id: row?.id,
    sku: row?.sku,
    name: row?.name,
    manufacturer: row?.manufacturer,
    category: row?.category,
    available: row?.available,
    allocated: row?.allocated,
    lowStockThreshold: row?.low_stock_threshold,
    location: row?.location,
    partnerPrice: row?.partner_price,
    msrp: row?.msrp,
    description: row?.description,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at
  };
};

export const productService = {
  async getAll() {
    try {
      const { data, error } = await supabase?.from('products')?.select('*')?.order('name', { ascending: true });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase?.from('products')?.select('*')?.eq('id', id)?.single();

      if (error) throw error;
      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(product) {
    try {
      // Validate input
      const validation = validateProduct(product);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const productData = convertToSnakeCase(product);

      const { data, error } = await supabase?.from('products')?.insert(productData)?.select()?.single();

      if (error) throw error;

      // Log creation
      await logDataChange('product', data?.id, 'create', null, productData);

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id, product) {
    try {
      // Validate input
      const validation = validateProduct(product);
      if (!validation.isValid) {
        return { data: null, error: { message: 'Validation failed', details: validation.errors } };
      }

      const productData = convertToSnakeCase(product);

      // Get old data for audit
      const { data: oldData } = await supabase?.from('products')?.select('*')?.eq('id', id)?.single();

      const { data, error } = await supabase?.from('products')?.update(productData)?.eq('id', id)?.select()?.single();

      if (error) throw error;

      // Log update
      await logDataChange('product', id, 'update', oldData, productData);

      // Check for low stock and send alert (fire-and-forget)
      const threshold = data?.low_stock_threshold || 10;
      if (isEmailEnabled() && data?.available <= threshold && oldData?.available > threshold) {
        notifyLowStock({ ...data, stock_quantity: data?.available, min_stock_level: threshold }, ['admin@distributorhub.com']).catch(console.error);
      }

      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      // Get data for audit
      const { data: oldData } = await supabase?.from('products')?.select('*')?.eq('id', id)?.single();

      const { error } = await supabase?.from('products')?.delete()?.eq('id', id);

      if (error) throw error;

      // Log deletion
      await logDataChange('product', id, 'delete', oldData, null);

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getLowStock() {
    try {
      const { data, error } = await supabase?.from('products')?.select('*')?.filter('available', 'lte', 'low_stock_threshold')?.order('available', { ascending: true });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};