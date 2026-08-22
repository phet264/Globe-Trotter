'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api/trips';
import { itineraryApi } from '@/lib/api/itinerary';
import { Trip, ItineraryActivity } from '@/lib/api/types';
import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, Plane, Bus, Settings, Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableActivity({ activity }: { activity: ItineraryActivity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex bg-white rounded-2xl border ${isDragging ? 'border-primary shadow-lg ring-1 ring-primary' : 'border-slate-100'} p-4 gap-4 transition-colors hover:border-slate-300`}>
      <button {...attributes} {...listeners} className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing self-start mt-1">
        <GripVertical size={20} />
      </button>
      
      <div className="flex flex-col items-center shrink-0">
        <span className="text-sm font-bold text-slate-900">{activity.time}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 truncate text-base">{activity.title}</h4>
        {activity.description && <p className="text-sm text-slate-500 line-clamp-2 mt-1">{activity.description}</p>}
        {activity.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <MapPin size={12} />
            <span className="truncate">{activity.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TripWorkspace({ tripId }: { tripId: string }) {
  const queryClient = useQueryClient();
  
  const { data: trip, isLoading: isTripLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripsApi.getTrip(tripId)
  });

  const { data: activities = [], isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['itinerary', tripId],
    queryFn: () => itineraryApi.getActivities(tripId)
  });

  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('09:00');

  const addActivityMutation = useMutation({
    mutationFn: itineraryApi.addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
      setIsAddingActivity(false);
      setNewActivityTitle('');
    }
  });

  const reorderActivitiesMutation = useMutation({
    mutationFn: itineraryApi.reorderActivities,
    onMutate: async (newOrderIds) => {
      await queryClient.cancelQueries({ queryKey: ['itinerary', tripId] });
      const previousActivities = queryClient.getQueryData<ItineraryActivity[]>(['itinerary', tripId]);
      
      if (previousActivities) {
        const optimistic = newOrderIds.map(id => previousActivities.find(a => a.id === id)!);
        queryClient.setQueryData(['itinerary', tripId], optimistic);
      }
      return { previousActivities };
    },
    onError: (err, newOrder, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(['itinerary', tripId], context.previousActivities);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: { active: { id: string | number }, over: { id: string | number } | null }) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = activities.findIndex((a) => a.id === active.id);
      const newIndex = activities.findIndex((a) => a.id === over.id);
      const newOrder = arrayMove(activities, oldIndex, newIndex);
      reorderActivitiesMutation.mutate(newOrder.map(a => a.id));
    }
  };

  const handleAddActivity = () => {
    if (!newActivityTitle) return;
    addActivityMutation.mutate({
      tripId,
      stopId: trip?.stops[0]?.id || 'unknown',
      title: newActivityTitle,
      time: newActivityTime,
      day: 1
    });
  };

  if (isTripLoading) {
    return (
      <div className="w-full h-full animate-pulse space-y-6">
        <div className="h-64 md:h-96 bg-slate-200 rounded-b-[3rem]" />
        <div className="px-6 md:px-10 max-w-5xl mx-auto space-y-6">
          <div className="w-1/3 h-10 bg-slate-200 rounded-xl" />
          <div className="w-1/2 h-6 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!trip) return <div className="p-10 text-center">Trip not found</div>;

  return (
    <div className="w-full h-full pb-24">
      {/* Premium Trip Header */}
      <div className="relative w-full h-[30vh] md:h-[45vh] rounded-b-[2rem] md:rounded-b-[3rem] overflow-hidden bg-slate-900 shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url('${trip.coverImage || '/placeholder.jpg'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-4">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary/90" />
                <span>{trip.stops.map(s => s.city).join(' · ')}</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary/90" />
                <span>{trip.startDate ? format(parseISO(trip.startDate), 'MMMM d') : 'TBD'} — {trip.endDate ? format(parseISO(trip.endDate), 'MMMM d, yyyy') : 'TBD'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white">
              <Settings size={16} className="mr-2" /> Edit Trip
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Journey Map/Stops */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Journey Route</h3>
            <div className="relative pl-6">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200" />
              
              {trip.stops.map((stop, i) => (
                <div key={stop.id} className="relative mb-8 last:mb-0">
                  <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-sm" />
                  <h4 className="text-lg font-bold text-slate-900">{stop.city}</h4>
                  <p className="text-sm text-slate-500 mb-4">{stop.country}</p>
                  
                  {i < trip.stops.length - 1 && stop.travelToNext && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 text-sm font-medium text-slate-600 relative z-10 -ml-2 mb-4">
                      {stop.travelToNext === 'AIRPLANE' && <Plane size={16} className="text-blue-500" />}
                      {stop.travelToNext === 'BUS' && <Bus size={16} className="text-orange-500" />}
                      {stop.travelToNext === 'TRAIN' && <Bus size={16} className="text-emerald-500" />}
                      Travel to {trip.stops[i+1].city}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-bold text-slate-900">Itinerary</h3>
            <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-medium">Day 1</div>
          </div>

          <div className="space-y-4">
            {isActivitiesLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-slate-500 mb-4">Your itinerary is waiting to be planned.</p>
                <Button onClick={() => setIsAddingActivity(true)} className="rounded-full bg-primary hover:bg-primary/90">
                  Add your first activity
                </Button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <SortableActivity key={activity.id} activity={activity} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {isAddingActivity ? (
              <div className="bg-white border border-primary/20 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Time</label>
                    <Input type="time" value={newActivityTime} onChange={e => setNewActivityTime(e.target.value)} className="h-10" />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Title</label>
                    <Input autoFocus value={newActivityTitle} onChange={e => setNewActivityTitle(e.target.value)} placeholder="e.g. Visit Eiffel Tower" className="h-10" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsAddingActivity(false)}>Cancel</Button>
                  <Button onClick={handleAddActivity} disabled={addActivityMutation.isPending} className="bg-primary hover:bg-primary/90 text-white">
                    {addActivityMutation.isPending ? 'Saving...' : 'Save Activity'}
                  </Button>
                </div>
              </div>
            ) : (
              activities.length > 0 && (
                <button 
                  onClick={() => setIsAddingActivity(true)}
                  className="w-full flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-200 hover:border-slate-300 rounded-2xl transition-colors text-slate-500 hover:text-slate-700 font-medium gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                  </div>
                  Add Activity
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
