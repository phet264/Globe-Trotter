'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Map, Plane, Compass, Bookmark, DollarSign, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Compass },
  { name: 'My Trips', href: '/trips', icon: Plane },
  { name: 'Explore', href: '/destinations', icon: Map },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'Budget', href: '/trips/1/budget', icon: DollarSign },
  { name: 'Profile', href: '/profile', icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-primary">GlobeTrotter</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="text-xs font-semibold text-slate-400 mb-2 px-2 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-auto pt-6" />
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 truncate">
              <div className="text-sm font-medium text-slate-900 truncate">{user?.name || 'Traveler'}</div>
              <div className="text-xs text-slate-500 truncate">{user?.email || ''}</div>
            </div>
            <button onClick={() => logout()} className="text-slate-400 hover:text-destructive transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden flex flex-col w-full h-full">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-primary">GlobeTrotter</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={20} />
          </Button>
        </header>

        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 w-full bg-white border-b border-slate-200 z-50 p-4 shadow-lg flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
            <div className="h-px bg-slate-100 my-2" />
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive text-left">
              <LogOut size={18} />
              Log out
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>

      {/* Desktop Main Content */}
      <main className="hidden md:flex flex-1 flex-col overflow-y-auto bg-slate-50 relative">
        {children}
      </main>
    </div>
  );
}
