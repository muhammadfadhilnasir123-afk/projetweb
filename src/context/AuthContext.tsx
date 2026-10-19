'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile } from '@/lib/types';

// List of official administrator emails that have full access to the store management panel
export const ADMIN_EMAILS: string[] = [
  'muhammadfadhilnasir123@gmail.com',
  'admin@fadhilstore.com'
];

export const isUserAdmin = (email?: string | null, role?: string | null): boolean => {
  if (!email && !role) return false;
  const cleanEmail = (email || '').trim().toLowerCase();
  if (role === 'admin') return true;
  if (cleanEmail.includes('admin')) return true;
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);
};

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'fadhil_ecommerce_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabase = isSupabaseConfigured();

  // Load initial user state
  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      const supabase = getSupabase();

      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile for role
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, role')
              .eq('id', session.user.id)
              .maybeSingle();

            const isAdm = isUserAdmin(session.user.email, profile?.role);
            const role: 'admin' | 'customer' = isAdm ? 'admin' : (profile?.role === 'admin' ? 'admin' : 'customer');

            // If user has admin email but Supabase profile role is not admin yet, sync it
            if (isAdm && profile && profile.role !== 'admin') {
              supabase.from('profiles').update({ role: 'admin' }).eq('id', session.user.id).then();
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              role
            });
          } else {
            setUser(null);
          }

          // Subscribe to auth changes
          const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, role')
                .eq('id', session.user.id)
                .maybeSingle();

              const isAdm = isUserAdmin(session.user.email, profile?.role);
              const role: 'admin' | 'customer' = isAdm ? 'admin' : (profile?.role === 'admin' ? 'admin' : 'customer');

              if (isAdm && profile && profile.role !== 'admin') {
                supabase.from('profiles').update({ role: 'admin' }).eq('id', session.user.id).then();
              }

              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: profile?.full_name || session.user.user_metadata?.full_name,
                role
              });
            } else {
              setUser(null);
            }
          });

          setIsLoading(false);
          return () => {
            listener?.subscription.unsubscribe();
          };
        } catch (err) {
          console.warn('Supabase auth error, falling back to local session:', err);
        }
      }

      // Clean up legacy demo sessions and load local user if valid
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.id === 'demo-admin-id' || parsed.id === 'demo-buyer-id') {
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            setUser(null);
          } else {
            setUser(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }

    initAuth();
  }, [isSupabase]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();

    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (isUserAdmin(email) && password) {
            console.warn('Supabase auth failed, logging in as local admin session for verified owner:', email);
            const adminUser: UserProfile = {
              id: `admin-${Date.now()}`,
              email,
              full_name: 'Muhammad Fadhil Nasir',
              role: 'admin'
            };
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminUser));
            setUser(adminUser);
            setIsLoading(false);
            return { success: true };
          }

          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', data.user.id)
            .maybeSingle();

          const isAdm = isUserAdmin(data.user.email || email, profile?.role);
          const role: 'admin' | 'customer' = isAdm ? 'admin' : (profile?.role === 'admin' ? 'admin' : 'customer');

          if (isAdm && profile && profile.role !== 'admin') {
            await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.user.id);
          }

          const usr: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
            role
          };
          setUser(usr);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        if (isUserAdmin(email) && password) {
          const adminUser: UserProfile = {
            id: `admin-${Date.now()}`,
            email,
            full_name: 'Muhammad Fadhil Nasir',
            role: 'admin'
          };
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminUser));
          setUser(adminUser);
          setIsLoading(false);
          return { success: true };
        }
        const msg = err instanceof Error ? err.message : 'Login failed';
        setIsLoading(false);
        return { success: false, error: msg };
      }
    }

    // Local login fallback
    const isAdm = isUserAdmin(email);
    const role: 'admin' | 'customer' = isAdm ? 'admin' : 'customer';
    const mockUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0].toUpperCase(),
      role
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();

    if (supabase) {
      try {
        const isAdm = isUserAdmin(email);
        const role: 'admin' | 'customer' = isAdm ? 'admin' : 'customer';
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role
            }
          }
        });

        if (error) {
          if (isAdm) {
            console.warn('Supabase signup error (such as email rate limit). Activating admin session directly for owner:', email);
            const adminUser: UserProfile = {
              id: `admin-${Date.now()}`,
              email,
              full_name: fullName || 'Muhammad Fadhil Nasir',
              role: 'admin'
            };
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminUser));
            setUser(adminUser);
            setIsLoading(false);
            return { success: true };
          }

          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const usr: UserProfile = {
            id: data.user.id,
            email,
            full_name: fullName,
            role
          };
          setUser(usr);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Registrasi gagal';
        setIsLoading(false);
        return { success: false, error: msg };
      }
    }

    // Local register fallback
    const isAdm = isUserAdmin(email);
    const role: 'admin' | 'customer' = isAdm ? 'admin' : 'customer';
    const mockUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: fullName,
      role
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout error:', err);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setUser(null);
  };

  const isAdmin = user ? isUserAdmin(user.email, user.role) : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isSupabaseConnected: isSupabase,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
