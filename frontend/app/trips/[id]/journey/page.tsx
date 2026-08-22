import React from 'react';
import { notFound } from 'next/navigation';
import Globe from '@/components/globe/Globe';
import { JourneySequenceManager } from '@/components/journey/JourneySequenceManager';

export default async function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col">
      {/* Full-screen immersive Globe */}
      <div className="absolute inset-0">
        <Globe interactive={true} />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex-1 flex flex-col pointer-events-none">
        
        {/* Top Header */}
        <header className="p-6 flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
            <h1 className="text-white font-bold text-lg">Journey Mode</h1>
          </div>
        </header>

        {/* Bottom Sequence Manager & Controls */}
        <div className="mt-auto p-6 lg:p-12 w-full max-w-4xl mx-auto">
          <div className="pointer-events-auto">
            <JourneySequenceManager tripId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
