'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemo: (role: 'admin' | 'customer') => void;
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
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              role: profile?.role || (session.user.email?.includes('admin') ? 'admin' : 'customer')
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
                .single();

              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: profile?.full_name || session.user.user_metadata?.full_name,
                role: profile?.role || (session.user.email?.includes('admin') ? 'admin' : 'customer')
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

      // Local storage fallback for demo
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
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
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', data.user.id)
            .single();

          const usr: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
            role: profile?.role || (email.toLowerCase().includes('admin') ? 'admin' : 'customer')
          };
          setUser(usr);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        setIsLoading(false);
        return { success: false, error: msg };
      }
    }

    // Demo/Local login fallback
    const role: 'admin' | 'customer' = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
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
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
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

    // Demo/Local register fallback
    const role: 'admin' | 'customer' = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
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

  const loginAsDemo = (role: 'admin' | 'customer') => {
    const demoUser: UserProfile = {
      id: role === 'admin' ? 'demo-admin-id' : 'demo-buyer-id',
      email: role === 'admin' ? 'admin@fadhilstore.com' : 'fadhil.buyer@gmail.com',
      full_name: role === 'admin' ? 'Fadhil (Store Admin)' : 'Fadhil Customer',
      role
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isSupabaseConnected: isSupabase,
        login,
        register,
        logout,
        loginAsDemo
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
