import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function TripsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-display font-bold mb-8">My Trips</h1>
        <div className="p-12 border border-dashed border-border/60 rounded-xl bg-card text-center">
          <h2 className="font-medium text-lg mb-2">No trips planned yet</h2>
          <p className="text-muted-foreground mb-6">Create your first itinerary to get started.</p>
          <button className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Create Trip
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
