'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { tripsApi } from '@/lib/api/trips';
import { TripStop } from '@/lib/api/types';
import Globe from '@/components/globe/Globe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Map, Calendar, Heart, IndianRupee } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTripDraft } from '@/lib/hooks/useTripDraft';

const tripSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  stops: z.array(z.object({
    id: z.string(),
    city: z.string(),
    country: z.string(),
    lat: z.number(),
    lng: z.number()
  })).min(1, 'Select at least one destination'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  interests: z.array(z.string()),
  budget: z.number().min(100, 'Minimum budget is 100').optional()
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"]
});

import { useDebounce } from '@/lib/hooks/useDebounce';
import { getMockImage } from '@/lib/utils/images';
import { destinationsApi } from '@/lib/api/destinations';

type TripFormData = z.infer<typeof tripSchema>;

const INTERESTS = ['Food & Dining', 'Art & Culture', 'History', 'Nature & Outdoors', 'Nightlife', 'Shopping', 'Relaxation', 'Adventure'];

const DEFAULT_VALUES: TripFormData = {
  name: '',
  stops: [],
  startDate: '',
  endDate: '',
  interests: [],
  budget: undefined
};

export function TripWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, hasDraft, isLoaded, saveDraft, clearDraft } = useTripDraft<TripFormData>(DEFAULT_VALUES);

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedLocation, setFocusedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues, trigger, formState: { errors }, reset } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange'
  });

  const formValues = watch();

  useEffect(() => {
    if (isLoaded && hasDraft) {
      // User requested to remove the "Resume Trip" screen.
      // Automatically clear old drafts to always start fresh.
      clearDraft(); 
    }
  }, [isLoaded, hasDraft, clearDraft]);

  // Save draft on every change
  useEffect(() => {
    if (isLoaded && !showDraftPrompt) {
      const currentValues = getValues();
      if (currentValues.name || currentValues.stops.length > 0) {
        saveDraft(currentValues);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formValues), isLoaded, showDraftPrompt, getValues, saveDraft]);

  const handleResumeDraft = () => {
    reset(draft);
    setShowDraftPrompt(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    reset(DEFAULT_VALUES);
    setShowDraftPrompt(false);
  };

  const createTripMutation = useMutation({
    mutationFn: tripsApi.createTrip,
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      clearDraft();
      router.push(`/trips/${newTrip.id}`);
    }
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof TripFormData)[] = [];
    if (step === 1) fieldsToValidate = ['stops'];
    if (step === 2) fieldsToValidate = ['name', 'startDate', 'endDate'];
    if (step === 3) fieldsToValidate = ['interests'];
    if (step === 4) fieldsToValidate = ['budget'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = (data: TripFormData) => {
    createTripMutation.mutate({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      interests: data.interests,
      stops: data.stops.map((s, i) => ({
        id: s.id,
        tripId: 'temp',
        city: s.city,
        country: s.country,
        lat: s.lat,
        lng: s.lng,
        order: i
      })) as TripStop[]
    });
  };

  if (showDraftPrompt) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Resume planning?</h2>
          <p className="text-slate-500 mb-8">You have an unfinished trip draft. Would you like to pick up where you left off?</p>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white" onClick={handleResumeDraft}>
              Resume Draft
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" onClick={handleDiscardDraft}>
              Start Fresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stops = formValues.stops || [];
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => destinationsApi.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const displayCities = (debouncedQuery.length >= 2 && searchResults) ? searchResults.cities.map(c => ({
    id: c.id,
    city: c.name,
    country: c.country?.name || '',
    lat: c.latitude,
    lng: c.longitude
  })) : [];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Left side: Wizard UI */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-white shadow-xl z-10 relative">
        {createTripMutation.isPending && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Creating your journey...</h2>
          </div>
        )}

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-slate-900">Plan a new journey</h1>
            <div className="text-sm font-medium text-slate-400">Step {step} of 5</div>
          </div>

          <div className="w-full h-1 bg-slate-100 rounded-full mb-10 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Where are you going?</h3>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search destinations..." className="pl-12 h-14 bg-slate-50 border-transparent text-lg rounded-2xl" />
                  </div>
                  
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                    {isSearchLoading ? (
                      <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
                    ) : debouncedQuery.length < 2 ? (
                      <div className="text-center p-4 text-slate-500">Type at least 2 characters to search for a city</div>
                    ) : displayCities.length === 0 ? (
                      <div className="text-center p-4 text-slate-500">No cities found matching "{debouncedQuery}"</div>
                    ) : (
                      displayCities.map(city => {
                        const isAdded = stops.some(s => s.city === city.city);
                        const bgImage = getMockImage(city.city, 400, 200);
                        return (
                          <div key={city.id} className="relative overflow-hidden group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors">
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }} />
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
                            
                            <div className="relative flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary backdrop-blur-sm">
                                <MapPin size={20} />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-lg">{city.city}</div>
                                <div className="text-sm font-medium text-slate-500">{city.country}</div>
                              </div>
                            </div>
                            <Button 
                              variant={isAdded ? "outline" : "default"} 
                              size="sm" 
                              onClick={() => {
                                if (!isAdded) {
                                  setValue('stops', [...stops, { ...city, id: `stop-${crypto.randomUUID()}` }]);
                                  setFocusedLocation({ lat: city.lat, lng: city.lng });
                                  trigger('stops');
                                } else {
                                  setValue('stops', stops.filter(s => s.city !== city.city));
                                }
                              }}
                              className="relative z-10 rounded-full shadow-sm"
                            >
                              {isAdded ? 'Remove' : 'Add'}
                            </Button>
                          </div>
                        )
                      })
                    )}
                  </div>
                  {errors.stops && <p className="text-destructive text-sm mt-2">{errors.stops.message}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">When are you traveling?</h3>
                
                <Controller name="name" control={control} render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Trip Name</label>
                    <Input {...field} placeholder="e.g. European Summer 2026" className={`h-12 bg-slate-50 ${errors.name ? 'border-destructive' : 'border-transparent'} text-lg`} />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                  </div>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <Controller name="startDate" control={control} render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                      <Input type="date" {...field} className={`h-12 bg-slate-50 ${errors.startDate ? 'border-destructive' : 'border-transparent'}`} />
                      {errors.startDate && <p className="text-destructive text-sm mt-1">{errors.startDate.message}</p>}
                    </div>
                  )} />
                  <Controller name="endDate" control={control} render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                      <Input type="date" {...field} className={`h-12 bg-slate-50 ${errors.endDate ? 'border-destructive' : 'border-transparent'}`} />
                      {errors.endDate && <p className="text-destructive text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                  )} />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What are your interests?</h3>
                <p className="text-slate-500 mb-6">Select all that apply to help us tailor your itinerary.</p>
                
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map(interest => {
                    const isSelected = formValues.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => {
                          const newInterests = isSelected 
                            ? formValues.interests.filter(i => i !== interest)
                            : [...formValues.interests, interest];
                          setValue('interests', newInterests);
                        }}
                        className={`px-5 py-3 rounded-full border text-sm font-medium transition-all flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-primary text-white border-primary shadow-md' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={16} />}
                        {interest}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What is your estimated budget?</h3>
                <p className="text-slate-500 mb-6">Set a total budget for the trip (optional).</p>
                
                <Controller name="budget" control={control} render={({ field }) => (
                  <div className="relative max-w-sm">
                    <IndianRupee className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <Input 
                      type="number" 
                      placeholder="e.g. 5000" 
                      className={`pl-12 h-14 bg-slate-50 text-xl font-medium ${errors.budget ? 'border-destructive' : 'border-transparent'} rounded-2xl`}
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    />
                    {errors.budget && <p className="text-destructive text-sm mt-2">{errors.budget.message}</p>}
                  </div>
                )} />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h3 className="text-2xl font-display font-bold text-slate-900">Review your journey</h3>
                
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Trip Details</div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">{formValues.name}</h2>
                  <div className="flex gap-2 text-slate-600 font-medium">
                    <Calendar size={18} />
                    {formValues.startDate} — {formValues.endDate}
                  </div>
                  {formValues.budget && (
                    <div className="flex gap-2 text-slate-600 font-medium">
                      <IndianRupee size={18} />
                      ₹{formValues.budget.toLocaleString()} Total Budget
                    </div>
                  )}
                  {formValues.interests.length > 0 && (
                    <div className="flex gap-2 text-slate-600 font-medium">
                      <Heart size={18} />
                      {formValues.interests.join(', ')}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Destinations</div>
                  <div className="space-y-0 relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 z-0" />
                    {stops.map((stop, i) => (
                      <div key={stop.id} className="relative z-10 flex items-center gap-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center text-primary font-bold text-xs">
                          {i + 1}
                        </div>
                        <div className="font-medium text-slate-900">{stop.city} <span className="text-slate-400 font-normal ml-2">{stop.country}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 md:px-10 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1 || createTripMutation.isPending} className="text-slate-500">
            <ChevronLeft size={16} className="mr-2" /> Back
          </Button>
          
          {step < 5 ? (
            <Button onClick={handleNext} className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-8">
              Continue <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }}
              disabled={createTripMutation.isPending}
              className="rounded-full bg-primary hover:bg-primary/90 text-white px-8"
            >
              {createTripMutation.isPending ? 'Creating...' : 'Create Trip'} <CheckCircle2 size={16} className="ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Right side: 3D Globe Visualizer */}
      <div className="hidden lg:block lg:w-1/2 h-full bg-white relative">
        <Globe
          markers={stops.map(s => ({
            id: s.id,
            lat: s.lat,
            lng: s.lng,
            city: s.city,
            country: s.country,
            type: 'major' as const
          }))}
          routes={stops.length > 1 ? stops.map((s, i) => i < stops.length - 1 ? {
            id: `route-${i}`,
            startLat: s.lat,
            startLng: s.lng,
            endLat: stops[i+1].lat,
            endLng: stops[i+1].lng,
            type: 'flight'
          } : null).filter(Boolean) as unknown[] : []}
          focusedLocation={focusedLocation}
          interactive={true}
        />
        
        {stops.length > 0 && (
          <div className="absolute bottom-10 left-10 z-20 bg-slate-900 backdrop-blur-md shadow-lg border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <Map className="text-white/80" size={24} />
            <div>
              <div className="text-white font-medium">{stops.length} {stops.length === 1 ? 'Destination' : 'Destinations'}</div>
              <div className="text-white/60 text-xs">Mapped on your journey</div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
