import { ItineraryActivity } from './types';

let MOCK_ACTIVITIES: ItineraryActivity[] = [
  {
    id: 'act-1',
    tripId: 'trip-1',
    stopId: 'stop-1',
    day: 1,
    date: '2026-09-12',
    time: '09:00',
    title: 'Breakfast at Café de Flore',
    location: '172 Bd Saint-Germain, 75006 Paris',
    cost: 30,
    order: 0,
  },
  {
    id: 'act-2',
    tripId: 'trip-1',
    stopId: 'stop-1',
    day: 1,
    date: '2026-09-12',
    time: '11:00',
    title: 'Eiffel Tower Tour',
    description: 'Skip the line tickets booked.',
    location: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
    order: 1,
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const itineraryApi = {
  getActivities: async (tripId: string): Promise<ItineraryActivity[]> => {
    await delay(500);
    return MOCK_ACTIVITIES.filter(a => a.tripId === tripId).sort((a, b) => a.order - b.order);
  },

  addActivity: async (data: Partial<ItineraryActivity>): Promise<ItineraryActivity> => {
    await delay(600);
    const newActivity: ItineraryActivity = {
      id: `act-${Date.now()}`,
      tripId: data.tripId!,
      stopId: data.stopId!,
      day: data.day || 1,
      date: data.date || '',
      time: data.time || '00:00',
      title: data.title || 'New Activity',
      description: data.description,
      location: data.location,
      cost: data.cost,
      order: MOCK_ACTIVITIES.filter(a => a.tripId === data.tripId && a.day === data.day).length,
    };
    MOCK_ACTIVITIES.push(newActivity);
    return newActivity;
  },

  updateActivity: async (id: string, data: Partial<ItineraryActivity>): Promise<ItineraryActivity> => {
    await delay(500);
    const index = MOCK_ACTIVITIES.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    MOCK_ACTIVITIES[index] = { ...MOCK_ACTIVITIES[index], ...data };
    return MOCK_ACTIVITIES[index];
  },

  deleteActivity: async (id: string): Promise<void> => {
    await delay(500);
    MOCK_ACTIVITIES = MOCK_ACTIVITIES.filter(a => a.id !== id);
  },

  reorderActivities: async (activityIds: string[]): Promise<ItineraryActivity[]> => {
    await delay(400);
    const updated: ItineraryActivity[] = [];
    activityIds.forEach((id, index) => {
      const act = MOCK_ACTIVITIES.find(a => a.id === id);
      if (act) {
        act.order = index;
        updated.push(act);
      }
    });
    return updated;
  }
};
