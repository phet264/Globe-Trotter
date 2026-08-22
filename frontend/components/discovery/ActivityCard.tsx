'use client';

import React, { useState } from 'react';
import { Activity } from '@/lib/api/types';
import { Clock, IndianRupee, Plus } from 'lucide-react';
import { getMockImage } from '@/lib/utils/images';

export function ActivityCard({ activity }: { activity: Activity }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = activity.imageUrl || getMockImage(activity.name);
  const fallbackUrl = getMockImage('travel');

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imgError ? fallbackUrl : imageUrl}
          alt={activity.name}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wide">
          {activity.category}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-slate-900 mb-1.5 line-clamp-1 text-base">{activity.name}</h4>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {activity.description || `Experience ${activity.name} in ${activity.city?.name || 'this destination'}.`}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            {activity.duration && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                {Math.floor(activity.duration / 60)}h{activity.duration % 60 > 0 ? ` ${activity.duration % 60}m` : ''}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <IndianRupee size={16} className="text-slate-400" />
              {activity.estimatedCost > 0 ? activity.estimatedCost : 'Free'}
            </div>
          </div>

          <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-600 transition-colors">
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
