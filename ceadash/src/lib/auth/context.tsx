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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Auth loading timeout - setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    // Check for demo mode
    const checkDemoMode = () => {
      const demoModeCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('demo-mode='));
      const isDemo = demoModeCookie?.split('=')[1] === 'true';
      setIsDemoMode(isDemo);
      
      if (isDemo) {
        // Sign in as demo user instead of using anon
        supabase.auth.signInWithPassword({
          email: 'demo@ceadash.com',
          password: 'demo123'
        }).then(({ data, error }) => {
          clearTimeout(timeoutId);
          if (error) {
            console.error('Demo login failed:', error);
            // Fallback to fake profile if login fails
            const demoOrgId = '00000000-0000-0000-0000-000000000001';
            const demoUserId = '00000000-0000-0000-0000-000000000002';
            
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
          } else {
            // Successfully logged in as demo user
            setSession(data.session);
            setUser(data.session?.user ?? null);
            if (data.session?.user) {
              loadUserProfile(data.session.user.id);
            }
          }
        }).catch((err) => {
          console.error('Demo login error:', err);
          clearTimeout(timeoutId);
          setLoading(false);
        });
        return;
      }
    };

    checkDemoMode();

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeoutId);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else if (!isDemoMode) {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Session fetch error:', error);
        clearTimeout(timeoutId);
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
          setOrganization(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile load error:', profileError);
        setLoading(false);
        return;
      }
      
      setProfile(profileData);

      // Load organization
      if (profileData?.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profileData.organization_id)
          .single();

        if (orgError) throw orgError;
        setOrganization(orgData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

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
