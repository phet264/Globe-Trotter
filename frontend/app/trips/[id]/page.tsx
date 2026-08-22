'use client';

import React, { use } from 'react';
import { TripWorkspace } from '@/components/trip/TripWorkspace';
import { CopilotChat } from '@/components/ai/CopilotChat';

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <div className="relative w-full h-full min-h-screen bg-slate-50">
      <TripWorkspace tripId={id} />
      <CopilotChat tripId={id} />
    </div>
  );
}
