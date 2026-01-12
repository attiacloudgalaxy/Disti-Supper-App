import { supabase } from '../lib/supabase';

const convertToSnakeCase = (obj) => {
  return {
    requirement: obj?.requirement,
    description: obj?.description,
    type: obj?.type,
    responsible: obj?.responsible,
    due_date: obj?.dueDate,
    priority: obj?.priority,
    status: obj?.status,
    progress: obj?.progress,
    department: obj?.department
  };
};

const convertToCamelCase = (row) => {
  return {
    id: row?.id,
    requirement: row?.requirement,
    description: row?.description,
    type: row?.type,
    responsible: row?.responsible,
    dueDate: row?.due_date,
    priority: row?.priority,
    status: row?.status,
    statusLabel: row?.status?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase()),
    progress: row?.progress,
    department: row?.department,
    icon: 'Shield',
    createdAt: row?.created_at,
    updatedAt: row?.updated_at
  };
};

export const complianceService = {
  async getAll() {
    try {
      const { data, error } = await supabase?.from('compliance_requirements')?.select('*')?.order('due_date', { ascending: true });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase?.from('compliance_requirements')?.select('*')?.eq('id', id)?.single();

      if (error) throw error;
      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(requirement) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const requirementData = convertToSnakeCase(requirement);

      const { data, error } = await supabase?.from('compliance_requirements')?.insert(requirementData)?.select()?.single();

      if (error) throw error;
      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id, requirement) {
    try {
      const requirementData = convertToSnakeCase(requirement);

      const { data, error } = await supabase?.from('compliance_requirements')?.update(requirementData)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data: data ? convertToCamelCase(data) : null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase?.from('compliance_requirements')?.delete()?.eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getByStatus(status) {
    try {
      const { data, error } = await supabase?.from('compliance_requirements')?.select('*')?.eq('status', status)?.order('due_date', { ascending: true });

      if (error) throw error;
      return { data: data?.map(convertToCamelCase) || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};