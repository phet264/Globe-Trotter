"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api/client";
import { Trip } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Calendar } from "lucide-react";

export default function TripDashboard({ params }: { params: Promise<{ tripId: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get<{ trip: Trip }>(`/v1/trips/${tripId}`);
        setTrip(res.trip);
      } catch (err) {
        console.error("Failed to load trip", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  if (isLoading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading trip dashboard...</div>;
  if (!trip) return <div className="p-12 text-center text-red-500">Trip not found.</div>;

  let plannedCost = 0;
  trip.tripStops?.forEach(stop => {
    stop.activities?.forEach(act => {
      if (act.estimatedCost) plannedCost += Number(act.estimatedCost);
    });
  });

  const remaining = (trip.budget || 0) - plannedCost;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{trip.title}</h1>
            <div className="flex flex-wrap items-center text-muted-foreground mt-3 gap-4">
              <span className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-sm"><MapPin className="w-4 h-4 mr-1.5"/> {trip.destination}</span>
              <span className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-sm"><Calendar className="w-4 h-4 mr-1.5"/> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
              <span className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-sm"><Users className="w-4 h-4 mr-1.5"/> {trip.travelers} Travelers</span>
            </div>
          </div>
          <Button variant="outline" className="shrink-0">Edit Trip</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Days</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-slate-900">{trip.tripStops?.length || 0}</p></CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Planned Cost</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-slate-900">{trip.currency || '$'}{plannedCost.toFixed(2)}</p></CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Remaining Budget</CardTitle></CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {trip.currency || '$'}{remaining.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Itinerary</h2>
        {(!trip.tripStops || trip.tripStops.length === 0) ? (
          <div className="p-12 text-center border-2 border-dashed rounded-xl bg-slate-50 text-muted-foreground">
            <p className="mb-4">Your itinerary is empty.</p>
            <Button>Add Day</Button>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {trip.tripStops.map((stop) => (
              <div key={stop.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Calendar className="w-4 h-4" />
                </div>
                
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center rounded-t-xl">
                    <h3 className="font-semibold text-lg text-slate-900">{stop.title} {stop.date && <span className="text-sm font-normal text-slate-500 ml-2">— {new Date(stop.date).toLocaleDateString()}</span>}</h3>
                    <Button size="sm" variant="secondary" className="shadow-none">Add Activity</Button>
                  </div>
                  <CardContent className="p-0">
                    {(!stop.activities || stop.activities.length === 0) ? (
                      <p className="p-6 text-sm text-slate-400 italic text-center">No activities planned yet.</p>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {stop.activities.map((act) => (
                          <li key={act.id} className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-center group/item cursor-pointer">
                            <div>
                              <p className="font-semibold text-slate-900">{act.title}</p>
                              <p className="text-sm text-slate-500 mt-1">{act.category} {act.location && `• ${act.location}`}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">{trip.currency || '$'}{act.estimatedCost || 0}</p>
                              <p className="text-xs text-slate-500 font-medium mt-1">
                                {act.startTime ? act.startTime.split('T')[1]?.substring(0,5) || 'Time TBD' : 'Time TBD'}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
