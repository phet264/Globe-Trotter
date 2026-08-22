'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { tripsApi } from '@/lib/api/trips';
import { useRouter } from 'next/navigation';

export function CopyTripButton({ tripId }: { tripId: string }) {
  const [isCopying, setIsCopying] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const { newTripId } = await tripsApi.copyTrip(tripId);
      router.push(`/trips/${newTripId}/itinerary`);
    } catch (error) {
      console.error('Failed to copy trip', error);
      setIsCopying(false);
    }
  };

  return (
    <Button 
      onClick={handleCopy} 
      disabled={isCopying} 
      className="w-full sm:w-auto"
      size="lg"
    >
      {isCopying ? 'Copying Trip...' : 'Copy This Trip'}
    </Button>
  );
}
