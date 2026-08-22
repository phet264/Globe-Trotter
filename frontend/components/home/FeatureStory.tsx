'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations/variants';
import { LucideIcon } from 'lucide-react';

interface FeatureStoryProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  imagePosition?: 'left' | 'right';
}

export function FeatureStory({ title, subtitle, description, icon: Icon, imagePosition = 'right' }: FeatureStoryProps) {
  return (
    <motion.div 
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className={`flex flex-col gap-12 lg:gap-24 items-center ${imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h4 className="text-sm font-semibold tracking-widest text-primary uppercase">{subtitle}</h4>
        <h3 className="font-display text-4xl font-bold tracking-tight">{title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
      
      <div className="flex-1 w-full">
        <div className="aspect-[4/3] w-full rounded-2xl bg-surface-secondary border border-border/50 shadow-2xl overflow-hidden relative">
          {/* Decorative placeholder for UI elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="absolute inset-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <span className="text-muted-foreground/50 font-display italic">Interactive Experience</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
