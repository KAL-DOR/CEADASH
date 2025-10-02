import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type ScheduledCall = Database['public']['Tables']['scheduled_calls']['Row'];
type ScheduledCallInsert = Database['public']['Tables']['scheduled_calls']['Insert'];
type ScheduledCallUpdate = Database['public']['Tables']['scheduled_calls']['Update'];

// Extended type with contact information
export interface ScheduledCallWithContact extends ScheduledCall {
  contact: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export class ScheduledCallsService {
  static async getAll(organizationId: string): Promise<ScheduledCallWithContact[]> {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .select(`
        *,
        contact:contacts(id, name, email, phone)
      `)
      .eq('organization_id', organizationId)
      .order('scheduled_date', { ascending: false });

    if (error) throw error;
    return data as ScheduledCallWithContact[] || [];
  }

  static async getById(id: string): Promise<ScheduledCallWithContact | null> {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .select(`
        *,
        contact:contacts(id, name, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ScheduledCallWithContact;
  }

  static async create(call: ScheduledCallInsert): Promise<ScheduledCall> {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .insert(call)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: ScheduledCallUpdate): Promise<ScheduledCall> {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('scheduled_calls')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getByStatus(
    organizationId: string, 
    status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress'
  ): Promise<ScheduledCallWithContact[]> {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .select(`
        *,
        contact:contacts(id, name, email, phone)
      `)
      .eq('organization_id', organizationId)
      .eq('status', status)
      .order('scheduled_date', { ascending: false });

    if (error) throw error;
    return data as ScheduledCallWithContact[] || [];
  }

  static async getUpcoming(organizationId: string): Promise<ScheduledCallWithContact[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('scheduled_calls')
      .select(`
        *,
        contact:contacts(id, name, email, phone)
      `)
      .eq('organization_id', organizationId)
      .eq('status', 'scheduled')
      .gte('scheduled_date', now)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data as ScheduledCallWithContact[] || [];
  }

  static async getByDateRange(
    organizationId: string,
    startDate: string,
    endDate: string
  ): Promise<ScheduledCallWithContact[]> {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .select(`
        *,
        contact:contacts(id, name, email, phone)
      `)
      .eq('organization_id', organizationId)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data as ScheduledCallWithContact[] || [];
  }

  static async search(organizationId: string, query: string): Promise<ScheduledCallWithContact[]> {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .select(`
        *,
        contact:contacts(id, name, email, phone)
      `)
      .eq('organization_id', organizationId)
      .or(`notes.ilike.%${query}%`)
      .order('scheduled_date', { ascending: false });

    if (error) throw error;
    return data as ScheduledCallWithContact[] || [];
  }

  static async getStats(organizationId: string) {
    const { data, error } = await supabase
      .from('scheduled_calls')
      .select('status, duration_minutes, scheduled_date')
      .eq('organization_id', organizationId);

    if (error) throw error;

    const now = new Date();
    const stats = {
      total: data?.length || 0,
      scheduled: data?.filter(c => c.status === 'scheduled').length || 0,
      completed: data?.filter(c => c.status === 'completed').length || 0,
      cancelled: data?.filter(c => c.status === 'cancelled').length || 0,
      upcoming: data?.filter(c => 
        c.status === 'scheduled' && new Date(c.scheduled_date) > now
      ).length || 0,
      averageDuration: 0,
    };

    const completedCalls = data?.filter(c => c.status === 'completed' && c.duration_minutes) || [];
    if (completedCalls.length > 0) {
      const totalDuration = completedCalls.reduce((sum, c) => sum + (c.duration_minutes || 0), 0);
      stats.averageDuration = Math.round(totalDuration / completedCalls.length);
    }

    return stats;
  }

  static async markEmailSent(id: string, emailId: string): Promise<void> {
    const { error } = await supabase
      .from('scheduled_calls')
      .update({ 
        email_sent: true, 
        email_id: emailId 
      })
      .eq('id', id);

    if (error) throw error;
  }
}

