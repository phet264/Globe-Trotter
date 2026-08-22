'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, Globe2, Plane } from 'lucide-react';
import { DestinationCard } from '@/components/home/DestinationCard';
import { FeatureStory } from '@/components/home/FeatureStory';
import { fadeUp, staggerContainer } from '@/lib/animations/variants';
import { GlobeFallback } from '@/components/globe/GlobeFallback';

// Lazy load the 3D globe to avoid blocking initial render
const Globe = dynamic(() => import('@/components/globe/Globe'), { 
  ssr: false,
  loading: () => <GlobeFallback />
});

export default function Home() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* 1. HERO SECTION (Split Layout) */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center container mx-auto px-4 py-12 gap-12 lg:gap-8">
        
        {/* Left: Copy & CTAs */}
        <motion.div 
          className="flex-1 w-full z-10 pt-12 lg:pt-0"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse"></span>
            GlobeTrotter Premium
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1]">
            YOUR JOURNEY.<br/>
            <span className="text-muted-foreground italic font-medium">BEAUTIFULLY PLANNED.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Plan multi-city journeys, discover remarkable destinations, organize activities, understand your budget, and experience your trip before you travel.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform" aria-label="Plan your trip">
              PLAN YOUR TRIP
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base hover:bg-primary/5 transition-colors" aria-label="Explore destinations">
              EXPLORE DESTINATIONS
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Right: 3D Globe */}
        <motion.div 
          className="flex-1 w-full h-[50vh] lg:h-[80vh] relative z-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
          <Globe />
        </motion.div>
      </section>

      {/* 2. THE WORLD (Destinations Showcase) */}
      <section className="py-32 bg-surface-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl font-display font-bold tracking-tight mb-4">Discover the remarkable.</h2>
              <p className="text-lg text-muted-foreground">Explore curated destinations handpicked for the modern traveler.</p>
            </div>
            <Button variant="ghost" className="rounded-full">See all destinations <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DestinationCard 
              city="Kyoto" country="Japan" 
              description="Experience the harmony of ancient temples and stunning zen gardens."
              imageUrl="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"
            />
            <DestinationCard 
              city="Santorini" country="Greece" 
              description="Iconic white-washed buildings clinging to dramatic volcanic cliffs."
              imageUrl="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop"
            />
            <DestinationCard 
              city="Reykjavik" country="Iceland" 
              description="A gateway to otherworldly landscapes and the northern lights."
              imageUrl="https://images.unsplash.com/photo-1504826260979-242151ce5d2d?q=80&w=800&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* 3. SCROLL STORY (Features) */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-4 space-y-32">
          <FeatureStory 
            title="Visualize your journey in 3D."
            subtitle="Discover"
            description="Our interactive 3D globe isn't just for show. Spin the world, discover new destinations, and see your entire multi-city route mapped out beautifully before you ever pack a bag."
            icon={Globe2}
            imagePosition="right"
          />
          
          <FeatureStory 
            title="Master complex itineraries."
            subtitle="Plan & Organize"
            description="Drag and drop days, sync activities, and manage your time perfectly. GlobeTrotter turns chaotic travel planning into an elegant, stress-free experience."
            icon={Calendar}
            imagePosition="left"
          />

          <FeatureStory 
            title="Travel together, seamlessly."
            subtitle="Collaborate"
            description="Share your live itinerary with friends and family. Everyone stays on the same page, with real-time updates and collaborative budgeting tools."
            icon={Users}
            imagePosition="right"
          />
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-32 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
            <Plane className="h-16 w-16 mx-auto mb-8 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Ready to see the world differently?
            </h2>
            <p className="text-xl opacity-90 mb-10 font-light">
              Join thousands of travelers designing their perfect journeys with GlobeTrotter.
            </p>
            <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-base text-primary shadow-2xl hover:scale-105 transition-transform">
              Start Planning Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
