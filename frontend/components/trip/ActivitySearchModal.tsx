'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Navigation, Plus, MapPin, DollarSign, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { itineraryApi } from '@/lib/api/itinerary';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { getMockImage } from '@/lib/utils/images';

interface ActivitySearchModalProps {
  tripId: string;
  stopId: string;
  cityId?: string;
  cityName?: string;
  onClose: () => void;
  day?: number;
}

export function ActivitySearchModal({ tripId, stopId, cityId, cityName, onClose, day = 1 }: ActivitySearchModalProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const queryClient = useQueryClient();

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['activities', cityId, debouncedQuery],
    queryFn: () => {
      // If we have a query, use global search. Otherwise use getActivities by cityId
      if (debouncedQuery.length >= 2) {
        return destinationsApi.search(debouncedQuery).then(res => res.activities);
      } else {
        return destinationsApi.getActivities({ cityId, pageSize: 20 }).then(res => res.items);
      }
    }
  });

  const addActivityMutation = useMutation({
    mutationFn: (activityData: { title: string; time: string; description?: string }) => 
      itineraryApi.addActivity({
        tripId,
        stopId,
        day,
        title: activityData.title,
        time: activityData.time,
        description: activityData.description
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
      onClose();
    }
  });

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50">
        <div className="p-6 pb-4 bg-white border-b border-slate-100 shadow-sm z-10">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-display font-bold">
              Find activities {cityName ? `in ${cityName}` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <Input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Search things to do..." 
              className="pl-12 h-14 bg-slate-50 border-slate-200 text-lg rounded-2xl" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {isSearchLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Discovering experiences...</p>
            </div>
          ) : !searchResults || searchResults.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              {query.length > 0 ? `No activities found matching "${query}"` : 'No activities available for this destination.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map(activity => {
                const bgImage = getMockImage(activity.name, 400, 300);
                return (
                  <div key={activity.id} className="group relative overflow-hidden bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-all duration-300 flex flex-col aspect-[4/3] isolate">
                    <img src={bgImage} alt={activity.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold text-white tracking-wide uppercase">
                      {activity.category}
                    </div>

                    <div className="relative flex-1 flex flex-col justify-end p-5">
                      <h4 className="font-bold text-white text-xl leading-tight mb-2">{activity.name}</h4>
                      
                      <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm mb-4">
                        {activity.estimatedCost > 0 && (
                          <div className="flex items-center gap-1"><DollarSign size={14} /> {activity.estimatedCost}</div>
                        )}
                        {activity.duration && (
                          <div className="flex items-center gap-1"><Clock size={14} /> {activity.duration}m</div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => addActivityMutation.mutate({ 
                          title: activity.name, 
                          time: '09:00', // Default time, could be improved to let user choose
                          description: activity.description
                        })}
                        disabled={addActivityMutation.isPending}
                        className="w-full bg-primary hover:bg-primary/90 rounded-full font-bold shadow-sm"
                      >
                        <Plus size={18} className="mr-2" /> Add to Itinerary
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
