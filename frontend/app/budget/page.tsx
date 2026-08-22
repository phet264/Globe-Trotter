'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api/trips';

export default function BudgetRedirectPage() {
  const router = useRouter();
  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getTrips
  });

  useEffect(() => {
    if (!isLoading) {
      if (trips && trips.length > 0) {
        // Redirect to the most recently created trip's budget
        router.replace(`/trips/${trips[0].id}/budget`);
      } else {
        router.replace('/trips');
      }
    }
  }, [trips, isLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}
