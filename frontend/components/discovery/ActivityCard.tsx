'use client';

import React from 'react';
import { Activity } from '@/lib/api/types';
import { Clock, DollarSign, Plus } from 'lucide-react';

const getMockImage = (name: string) => {
  const seed = name.toLowerCase().replace(/[^a-z]/g, '');
  return `https://source.unsplash.com/600x400/?activity,${seed}`;
};

export function ActivityCard({ activity }: { activity: Activity }) {
  const imageUrl = getMockImage(activity.name);

  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={activity.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-sm">
          {activity.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-bold text-slate-900 mb-1 line-clamp-1 text-lg">{activity.name}</h4>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {activity.description || 'Experience this wonderful activity in ' + (activity.city?.name || 'this city') + '.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            {activity.duration && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-slate-400" />
                {Math.floor(activity.duration / 60)}h {activity.duration % 60 > 0 ? `${activity.duration % 60}m` : ''}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <DollarSign size={16} className="text-slate-400" />
              {activity.estimatedCost}
            </div>
          </div>
          
          <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center text-slate-600 transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
