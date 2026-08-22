'use client';

import { useState, useEffect } from 'react';

const DRAFT_KEY = 'globetrotter_trip_draft';

export function useTripDraft<T>(defaultValues: T) {
  const [draft, setDraft] = useState<T>(defaultValues);
  const [hasDraft, setHasDraft] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved && mounted) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft(JSON.parse(saved));
        setHasDraft(true);
      }
    } catch (e) {
      console.error('Failed to load trip draft', e);
    } finally {
      if (mounted) setIsLoaded(true);
    }
    return () => { mounted = false; };
  }, []);

  const saveDraft = (data: T) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      setDraft(data);
      setHasDraft(true);
    } catch (e) {
      console.error('Failed to save trip draft', e);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setDraft(defaultValues);
      setHasDraft(false);
    } catch (e) {
      console.error('Failed to clear trip draft', e);
    }
  };

  return {
    draft,
    hasDraft,
    isLoaded,
    saveDraft,
    clearDraft,
  };
}
