import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GlobeTrotter | Authentication',
  description: 'Sign in or create an account for GlobeTrotter.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Stunning lush green mountain landscape
  const bgImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop";

  return (
    <div 
      className="h-[100dvh] flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Dark overlay for better contrast of the central card against the background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Absolute Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all shadow-lg border border-white/20" aria-label="Back to home">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </Link>

      {/* Main Card - auto height to fit content, with max-height to prevent viewport overflow */}
      <div className="relative z-10 w-full max-w-5xl bg-background rounded-[2rem] sm:rounded-[2.5rem] flex flex-col lg:flex-row shadow-2xl overflow-hidden h-auto lg:h-auto min-h-[500px] max-h-[90vh]">
        
        {/* Left Side - Form Container */}
        <div className="w-full lg:w-[45%] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col relative z-20 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <Link href="/" className="mb-2 xl:mb-4 inline-block shrink-0">
            <span className="font-display text-lg lg:text-xl font-bold tracking-tight text-primary">GlobeTrotter</span>
          </Link>
          
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            {children}
          </div>
        </div>

        {/* Right Side - Image container without text overlays */}
        <div className="hidden lg:block lg:w-[55%] p-3 sm:p-4 pl-0 shrink-0">
          <div 
            className="w-full h-full rounded-[1.5rem] sm:rounded-[2rem] bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url('${bgImage}')` }}
          >
            {/* Dark gradient overlay for a polished look without text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
          </div>
        </div>

      </div>
    </div>
  );
}
