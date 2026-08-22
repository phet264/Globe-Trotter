import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-display font-bold mb-8">Profile Settings</h1>
        <div className="space-y-6">
          <div className="p-6 border border-border/40 rounded-xl bg-card">
            <h2 className="font-medium text-lg mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="font-medium">GlobeTrotter User</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
