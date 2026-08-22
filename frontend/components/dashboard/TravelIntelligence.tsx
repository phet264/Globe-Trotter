'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Brain, Settings2, Trash2, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function TravelIntelligence() {
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = (await api.get('/v1/profile')) as any;
      return res.data as {
        preferences: { category: string; score: number; confidence: number; source: string }[];
        insights: { type: string; title: string; description: string; confidence: number }[];
      };
    },
    retry: 1
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      await api.post('/v1/profile/reset');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setShowSettings(false);
    }
  });

  if (isLoading) return null; // Or a skeleton
  if (isError || !data) return null;

  const topPreferences = data.preferences.filter(p => p.score > 20).slice(0, 4);

  if (topPreferences.length === 0 && data.insights.length === 0) {
    return null; // Don't show if no intel
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 text-primary/10 -z-0">
        <Brain size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={24} className="text-primary" />
              Travel Intelligence
            </h3>
            <p className="text-slate-500">Learned from your travel behavior</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings2 className="text-slate-500" />
          </Button>
        </div>

        {showSettings ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-start">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <ShieldAlert size={18} /> Manage Personalization
            </h4>
            <p className="text-red-700 text-sm mb-4">
              You can reset the AI's learned preferences. This will delete all your inferred travel styles and behavioral insights, returning you to a clean slate.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => { if(window.confirm('Reset all learned preferences?')) resetMutation.mutate(); }}
              disabled={resetMutation.isPending}
            >
              <Trash2 size={16} className="mr-2" /> Reset Learned Profile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Travel Style */}
            {topPreferences.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Your Travel Style</h4>
                <div className="space-y-4">
                  {topPreferences.map(pref => (
                    <div key={pref.category}>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-slate-700">{pref.category}</span>
                        <span className="text-slate-500">{Math.round(pref.score)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, pref.score)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {data.insights.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Travel Insights</h4>
                <div className="space-y-3">
                  {data.insights.map(insight => (
                    <div key={insight.title} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 font-medium text-slate-900 mb-1">
                        <TrendingUp size={16} className="text-primary" />
                        {insight.title}
                      </div>
                      <p className="text-sm text-slate-600">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
