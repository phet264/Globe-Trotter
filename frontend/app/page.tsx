import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Compass, Map, Calendar, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            GlobeTrotter Phase 1 Foundation
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            Design your perfect journey, <span className="text-muted-foreground italic">effortlessly.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            Plan multi-city itineraries, manage your travel budget, and explore the world with an elegant, interactive experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <Button size="lg" className="rounded-full px-8 h-14 text-base w-full sm:w-auto">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base w-full sm:w-auto">
              Explore Destinations
            </Button>
          </div>
        </div>
        
        {/* Placeholder for 3D Globe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-50" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-4">Everything you need to travel well</h2>
            <p className="text-muted-foreground text-lg">A sophisticated suite of tools designed for the modern explorer.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Compass, title: 'Explore', desc: 'Discover hidden gems and popular spots.' },
              { icon: Map, title: 'Itinerary', desc: 'Map out your multi-city adventures.' },
              { icon: Calendar, title: 'Timeline', desc: 'Keep your dates and activities in sync.' },
              { icon: Users, title: 'Share', desc: 'Collaborate with your travel companions.' },
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
