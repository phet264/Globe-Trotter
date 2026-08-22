'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShareTripDialog } from './ShareTripDialog';
import { useRouter } from 'next/navigation';

export function ShareTripAction({ tripId }: { tripId: string }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setIsShareOpen(true)}>
          Share Trip
        </Button>
        <Button onClick={() => router.push(`/trips/${tripId}/journey`)}>
          ▶ Journey Mode
        </Button>
      </div>

      <ShareTripDialog 
        tripId={tripId} 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
      />
    </>
  );
}
