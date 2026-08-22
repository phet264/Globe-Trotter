'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold tracking-tight">Something went wrong</h2>
        <p className="text-muted-foreground max-w-[500px] mx-auto">
          We encountered an unexpected issue while loading this page. Our team has been notified.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => router.push('/')} variant="outline" size="lg" className="rounded-full">
          Return Home
        </Button>
        <Button onClick={() => reset()} variant="default" size="lg" className="rounded-full">
          Try Again
        </Button>
      </div>
      {error.digest && (
        <p className="text-xs text-muted-foreground mt-8">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
