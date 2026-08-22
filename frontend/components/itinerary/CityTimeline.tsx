'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { itineraryApi } from '@/lib/api/itinerary';
import { ItineraryActivity } from '@/lib/api/types';
import ActivityEditor from './ActivityEditor';
import { useTravelTransition } from '@/components/globe/TravelTransitionEngine';
import { useMapSync } from '@/components/globe/MapSyncContext';
import { Button } from '@/components/ui/button';

interface CityTimelineProps {
  tripId: string;
}

export default function CityTimeline({ tripId }: CityTimelineProps) {
  const [activities, setActivities] = useState<ItineraryActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<ItineraryActivity | null>(null);
  const { startTransition } = useTravelTransition();
  const { hoveredCityId, setHoveredCityId, selectedCityId, setSelectedCityId } = useMapSync();

  useEffect(() => {
    loadActivities();
  }, [tripId]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await itineraryApi.getActivities(tripId);
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(activities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic UI update
    setActivities(items);

    try {
      // Reorder on backend
      await itineraryApi.reorderActivities(items.map(i => i.id));
    } catch (error) {
      console.error('Reorder failed', error);
      // Rollback on failure
      setActivities(activities);
    }
  };

  const handleSimulateTravel = () => {
    // Simulated transition between Paris and Amsterdam
    startTransition(
      { id: '1', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
      { id: '2', lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands' },
      false, // different country -> airplane
      false  // not nearby
    );
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading itinerary...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSimulateTravel} variant="outline" className="gap-2">
          ✈ Simulate Travel
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="activities">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {activities.map((activity, index) => (
                <Draggable key={activity.id} draggableId={activity.id} index={index}>
                  {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onMouseEnter={() => setHoveredCityId(activity.stopId)}
                        onMouseLeave={() => setHoveredCityId(null)}
                        onClick={() => setSelectedCityId(activity.stopId)}
                        className={`bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between group transition-colors cursor-pointer ${
                          selectedCityId === activity.stopId ? 'border-blue-500 ring-1 ring-blue-500' :
                          hoveredCityId === activity.stopId ? 'border-slate-300 bg-slate-50' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-500">{activity.time}</span>
                          <span className="text-lg font-medium text-slate-900">{activity.title}</span>
                          {activity.location && (
                            <span className="text-sm text-slate-500">{activity.location}</span>
                          )}
                        </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setEditingActivity(activity)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingActivity && (
        <ActivityEditor 
          activity={editingActivity} 
          onClose={() => setEditingActivity(null)}
          onSave={loadActivities}
        />
      )}
    </div>
  );
}
