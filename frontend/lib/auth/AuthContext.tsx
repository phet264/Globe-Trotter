'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, authApi } from '@/lib/api/auth';
import { useRouter, usePathname } from 'next/navigation';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (data: Record<string, unknown>) => Promise<void>;
  signup: (data: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.me();
        setUser(res.user);
        setStatus('authenticated');
      } catch {
        setUser(null);
        setStatus('unauthenticated');
      }
    };
    checkAuth();
  }, []);

  const login = async (data: Record<string, unknown>) => {
    const res = await authApi.login(data);
    setUser(res.user);
    setStatus('authenticated');
    
    // Redirect if we're on an auth page or have a pending redirect
    const redirectUrl = localStorage.getItem('auth_redirect');
    if (redirectUrl) {
      localStorage.removeItem('auth_redirect');
      router.push(redirectUrl);
    } else if (pathname.startsWith('/auth')) {
      router.push('/dashboard');
    }
  };

  const signup = async (data: Record<string, unknown>) => {
    const res = await authApi.signup(data);
    setUser(res.user);
    setStatus('authenticated');
    
    const redirectUrl = localStorage.getItem('auth_redirect');
    if (redirectUrl) {
      localStorage.removeItem('auth_redirect');
      router.push(redirectUrl);
    } else if (pathname.startsWith('/auth')) {
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setStatus('unauthenticated');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout }}>
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
