// @ts-nocheck
import { z } from 'zod';
import { tool } from 'ai';
import { prisma } from '@/lib/db/prisma';
import { getRecommendations } from '@/lib/services/recommendation';
import { buildTripContext } from './context';

// Reusable context fetcher for read tools
const getContext = async (tripId: string, userId: string) => {
  return await buildTripContext(tripId, userId);
};

export const getTripTools = (userId: string, tripId: string) => {
  return {
    get_trip_summary: tool({
      description: 'Get the full trip summary including current destination, dates, preferences, and top-level logistics.',
      parameters: z.object({}),
      execute: async (_args: any) => {
        const ctx = await getContext(tripId, userId);
        return {
          name: ctx.name,
          destination: ctx.destination,
          dates: ctx.dates,
          budget: ctx.budget,
          currency: ctx.currency,
          preferences: ctx.preferences,
          status: ctx.status,
          travelers: ctx.travelers,
        };
      },
    }),
    
    get_itinerary: tool({
      description: 'Get the detailed day-by-day itinerary including activities.',
      parameters: z.object({}),
      execute: async (_args: any) => {
        const ctx = await getContext(tripId, userId);
        return { itinerary: ctx.itinerary };
      },
    }),

    get_budget_summary: tool({
      description: 'Get the trip budget summary, projected costs, breakdown, and remaining budget.',
      parameters: z.object({}),
      execute: async (_args: any) => {
        const ctx = await getContext(tripId, userId);
        return { budget: ctx.intelligence.costSummary };
      },
    }),

    get_trip_conflicts: tool({
      description: 'Check for any overlapping activities, missing transport, or scheduling conflicts in the trip.',
      parameters: z.object({}),
      execute: async (_args: any) => {
        const ctx = await getContext(tripId, userId);
        return { conflicts: ctx.intelligence.conflicts };
      },
    }),

    get_trip_readiness: tool({
      description: 'Check how ready the trip is for travel. Returns a score and lists pending vs completed checks.',
      parameters: z.object({}),
      execute: async (_args: any) => {
        const ctx = await getContext(tripId, userId);
        return { readiness: ctx.intelligence.readiness };
      },
    }),

    get_recommendations: tool({
      description: 'Get intelligent place/activity recommendations based on user preferences and current destination.',
      parameters: z.object({}),
      execute: async (_args: any) => {
        const trip = await prisma.trip.findUnique({ where: { id: tripId, userId } });
        if (!trip || !trip.destinationId) return { error: 'No destination configured.' };
        
        const recommendedPlaces = await getRecommendations(tripId);
        return { recommendations: recommendedPlaces };
      },
    }),

    propose_action: tool({
      description: 'Propose a modification to the itinerary or trip logistics (e.g. adding, moving, removing an activity, accommodation, etc.). This DOES NOT execute the action, it only generates a structured proposal for the user to confirm.',
      parameters: z.object({
        actionType: z.enum(['ADD_ACTIVITY', 'REMOVE_ACTIVITY', 'MOVE_ACTIVITY', 'ADD_ACCOMMODATION', 'UPDATE_BUDGET']),
        description: z.string().describe('User friendly description of what this action does.'),
        parameters: z.any().describe('The payload containing IDs, new dates, new values etc.'),
        expectedImpact: z.string().describe('Explain the impact on budget or time.'),
      }),
      execute: async (args: any) => {
        // Return structured proposal for UI rendering.
        // It requiresConfirmation, so the UI will intercept this.
        return {
          requiresConfirmation: true,
          proposal: args
        };
      },
    })
  } as any;
};
