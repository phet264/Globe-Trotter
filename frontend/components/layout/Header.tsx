'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const { status, logout } = useAuth();
  const pathname = usePathname();

  if (pathname.startsWith('/auth') || pathname.startsWith('/dashboard') || pathname.startsWith('/trips')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex gap-2 items-center hover:opacity-80 transition-opacity">
          <span className="font-display text-2xl font-bold tracking-tight">GlobeTrotter</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/destinations" className="text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          {status === 'authenticated' && (
            <>
              <Link href="/trips" className="text-muted-foreground hover:text-foreground transition-colors">Trips</Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="w-20 h-8 animate-pulse bg-muted rounded-full" />
          ) : status === 'authenticated' ? (
            <>
              <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block">
                Profile
              </Link>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
                Sign In
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="rounded-full">
                  Start Planning
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
