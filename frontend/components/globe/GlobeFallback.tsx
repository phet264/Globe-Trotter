import React from 'react';
import { Compass } from 'lucide-react';

interface GlobeFallbackProps {
  message?: string;
}

export function GlobeFallback({ message = "Initializing Experience..." }: GlobeFallbackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-primary/5 animate-pulse">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
        <Compass className="h-10 w-10 text-primary animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110 animate-ping" style={{ animationDuration: '3s' }} />
      </div>
      <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">{message}</p>
    </div>
  );
}

export function WebGLFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-surface">
      <div className="h-40 w-40 rounded-full bg-gradient-to-tr from-primary/80 to-accent/40 shadow-2xl shadow-primary/20 mb-8 flex items-center justify-center">
        <Compass className="h-12 w-12 text-primary-foreground opacity-50" />
      </div>
      <h3 className="font-display text-xl font-medium mb-2">3D Experience Unavailable</h3>
      <p className="text-muted-foreground text-sm text-center max-w-xs">
        Your device or browser doesn&apos;t support WebGL. You can still use all core features of GlobeTrotter.
      </p>
    </div>
  );
}
