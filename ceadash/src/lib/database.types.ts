export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      processes: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          status: 'draft' | 'active' | 'archived'
          efficiency_score: number | null
          diagram_data: Json | null
          improvements_data: Json | null
          transcription_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          status?: 'draft' | 'active' | 'archived'
          efficiency_score?: number | null
          diagram_data?: Json | null
          improvements_data?: Json | null
          transcription_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          status?: 'draft' | 'active' | 'archived'
          efficiency_score?: number | null
          diagram_data?: Json | null
          improvements_data?: Json | null
          transcription_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          organization_id: string
          name: string
          email: string
          phone: string | null
          status: 'active' | 'inactive'
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          email: string
          phone?: string | null
          status?: 'active' | 'inactive'
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          email?: string
          phone?: string | null
          status?: 'active' | 'inactive'
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      scheduled_calls: {
        Row: {
          id: string
          organization_id: string
          contact_id: string
          process_id: string | null
          scheduled_date: string
          status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress'
          duration_minutes: number | null
          notes: string | null
          email_sent: boolean
          email_id: string | null
          bot_connection_url: string | null
          transcription_data: Json | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          contact_id: string
          process_id?: string | null
          scheduled_date: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'in_progress'
          duration_minutes?: number | null
          notes?: string | null
          email_sent?: boolean
          email_id?: string | null
          bot_connection_url?: string | null
          transcription_data?: Json | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          contact_id?: string
          process_id?: string | null
          scheduled_date?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'in_progress'
          duration_minutes?: number | null
          notes?: string | null
          email_sent?: boolean
          email_id?: string | null
          bot_connection_url?: string | null
          transcription_data?: Json | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      transcriptions: {
        Row: {
          id: string
          organization_id: string
          call_id: string | null
          content: string
          metadata: Json | null
          processed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          call_id?: string | null
          content: string
          metadata?: Json | null
          processed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          call_id?: string | null
          content?: string
          metadata?: Json | null
          processed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

