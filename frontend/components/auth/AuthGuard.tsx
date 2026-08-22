'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Save the intended destination to redirect back after login
      localStorage.setItem('auth_redirect', pathname);
      router.push('/auth/login');
    }
  }, [status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-r-transparent animate-spin" />
          <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading session...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
