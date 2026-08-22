import React from 'react';
import { Compass, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-display text-2xl font-bold tracking-tight">GlobeTrotter</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Design your perfect journey with our premium travel planning tools. Organize itineraries, track budgets, and share with friends.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Locations">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Interactive Globe</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Itinerary Builder</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Designed for the modern explorer.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
