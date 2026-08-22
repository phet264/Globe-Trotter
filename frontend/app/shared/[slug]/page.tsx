import React from 'react';
import { notFound } from 'next/navigation';
import Globe from '@/components/globe/Globe';
import { CopyTripButton } from '@/components/trip/CopyTripButton';

// For simplicity, we are mocking the shared trip data fetching.
// In a real app, this would be a dedicated public endpoint that filters private info.
export default async function SharedTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  // Extract ID if slug is like "mock-trip-1"
  const tripId = slug.split('-').pop() || '1';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Public Details */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-slate-50 border-r border-slate-200">
          <div className="p-6 sm:p-8 space-y-8">
            <header className="space-y-4">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                Public Trip
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">European Summer Adventure</h1>
              <p className="text-lg text-slate-600">A breathtaking 14-day journey across the iconic cities of Europe.</p>
              
              <div className="pt-4 border-t border-slate-200">
                <CopyTripButton tripId={tripId} />
              </div>
            </header>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Itinerary Highlights</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900">Paris, France</h3>
                  <p className="text-slate-500 text-sm mt-1">Eiffel Tower, Louvre Museum, Seine River Cruise</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900">Amsterdam, Netherlands</h3>
                  <p className="text-slate-500 text-sm mt-1">Canal Tour, Van Gogh Museum</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900">Berlin, Germany</h3>
                  <p className="text-slate-500 text-sm mt-1">Brandenburg Gate, Museum Island</p>
                </div>
              </div>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Budget Estimate</h2>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                <span className="text-slate-600">Estimated Total</span>
                <span className="font-bold text-xl text-slate-900">~$2,500</span>
              </div>
            </section>
          </div>
        </div>

        {/* Right Panel: Interactive Globe */}
        <div className="hidden lg:block w-1/2 bg-black relative">
          <Globe interactive={true} />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white/80 px-4 py-2 rounded-full text-sm">
            Drag to explore the journey
          </div>
        </div>
      </div>
    </div>
  );
}
