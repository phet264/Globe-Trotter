import React from 'react';
import { notFound } from 'next/navigation';
import CityTimeline from '@/components/itinerary/CityTimeline';
import Globe from '@/components/globe/Globe';
import { JourneyControls } from '@/components/journey/JourneyControls';
import { ShareTripAction } from '@/components/trip/ShareTripAction';

export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Timeline & Details */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-slate-50 border-r border-slate-200">
          <div className="p-6 sm:p-8 space-y-8">
            <header className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trip Itinerary</h1>
                <p className="text-slate-500 mt-2">Manage your destinations and daily activities.</p>
              </div>
              <ShareTripAction tripId={id} />
            </header>
            
            <CityTimeline tripId={id} />
          </div>
        </div>
        
        {/* Right Panel: Interactive Globe */}
        <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
          <Globe interactive={true} />
          <JourneyControls />
        </div>
      </div>
    </div>
  );
}
