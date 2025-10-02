"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Organization = Database['public']['Tables']['organizations']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  organization: Organization | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, organizationName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(null);
  const [session] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Always use demo mode - no authentication required
    const demoOrgId = '00000000-0000-0000-0000-000000000001';
    const demoUserId = '00000000-0000-0000-0000-000000000002';
    
    setIsDemoMode(true);
    setProfile({
      id: demoUserId,
      organization_id: demoOrgId,
      email: 'demo@ceadash.com',
      full_name: 'Usuario Demo',
      avatar_url: null,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setOrganization({
      id: demoOrgId,
      name: 'Organización Demo',
      slug: 'demo-org',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      settings: {},
    });
    setLoading(false);
  }, []);

  // Not needed in demo mode - profile is set directly
  // const loadUserProfile = async (userId: string) => { ... };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, organizationName: string) => {
    try {
      // Create user account
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization_name: organizationName,
          }
        }
      });

      if (authError) return { error: authError };

      // The profile and organization will be created via database triggers
      // or you can create them here if you prefer

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      // Clear demo mode
      document.cookie = 'demo-mode=; max-age=0; path=/';
      setIsDemoMode(false);
      setProfile(null);
      setOrganization(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  const value = {
    user,
    session,
    profile,
    organization,
    loading,
    isDemoMode,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
