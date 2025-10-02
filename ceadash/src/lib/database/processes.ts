import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Process = Database['public']['Tables']['processes']['Row'];
type ProcessInsert = Database['public']['Tables']['processes']['Insert'];
type ProcessUpdate = Database['public']['Tables']['processes']['Update'];

export class ProcessesService {
  static async getAll(organizationId: string): Promise<Process[]> {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<Process | null> {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(process: ProcessInsert): Promise<Process> {
    const { data, error } = await supabase
      .from('processes')
      .insert(process)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: ProcessUpdate): Promise<Process> {
    const { data, error } = await supabase
      .from('processes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('processes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getByStatus(organizationId: string, status: 'draft' | 'active' | 'archived'): Promise<Process[]> {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async search(organizationId: string, query: string): Promise<Process[]> {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('organization_id', organizationId)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getStats(organizationId: string) {
    const { data, error } = await supabase
      .from('processes')
      .select('status, efficiency_score')
      .eq('organization_id', organizationId);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      active: data?.filter(p => p.status === 'active').length || 0,
      draft: data?.filter(p => p.status === 'draft').length || 0,
      archived: data?.filter(p => p.status === 'archived').length || 0,
      averageEfficiency: 0,
    };

    const processesWithEfficiency = data?.filter(p => p.efficiency_score !== null) || [];
    if (processesWithEfficiency.length > 0) {
      const totalEfficiency = processesWithEfficiency.reduce((sum, p) => sum + (p.efficiency_score || 0), 0);
      stats.averageEfficiency = Math.round(totalEfficiency / processesWithEfficiency.length);
    }

    return stats;
  }
}

