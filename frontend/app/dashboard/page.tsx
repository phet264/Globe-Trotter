import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-display font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-border/40 rounded-xl bg-card">
            <h2 className="font-medium text-lg mb-2">Upcoming Trips</h2>
            <p className="text-muted-foreground">You have no upcoming trips.</p>
          </div>
          <div className="p-6 border border-border/40 rounded-xl bg-card">
            <h2 className="font-medium text-lg mb-2">Saved Destinations</h2>
            <p className="text-muted-foreground">Start exploring to save destinations.</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
