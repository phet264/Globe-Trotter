'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Map, Navigation, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '@/lib/api/destinations';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => destinationsApi.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = data && (data.countries.length > 0 || data.cities.length > 0 || data.activities.length > 0);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-slate-400" size={20} />
        <input
          type="text"
          className="w-full h-14 pl-12 pr-4 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 placeholder:text-slate-500 transition-all text-lg"
          placeholder="Search destinations, cities, or activities..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 text-primary animate-spin" size={20} />
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {isLoading && !data ? (
            <div className="p-8 text-center text-slate-500">Searching...</div>
          ) : !hasResults && data ? (
            <div className="p-8 text-center text-slate-500">No results found for &quot;{query}&quot;</div>
          ) : data ? (
            <div className="py-2">
              {data.countries.length > 0 && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Countries</h3>
                  {data.countries.map(country => (
                    <button
                      key={country.id}
                      onClick={() => { router.push(`/destinations/countries/${country.slug}`); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <Map className="text-slate-400" size={18} />
                      <span className="font-medium text-slate-900">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {data.cities.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cities</h3>
                  {data.cities.map(city => (
                    <button
                      key={city.id}
                      onClick={() => { router.push(`/destinations/cities/${city.slug}`); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <MapPin className="text-slate-400" size={18} />
                      <div>
                        <div className="font-medium text-slate-900">{city.name}</div>
                        <div className="text-xs text-slate-500">{city.country?.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {data.activities.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Activities</h3>
                  {data.activities.map(activity => (
                    <button
                      key={activity.id}
                      onClick={() => { router.push(`/destinations/cities/${activity.city?.slug}`); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <Navigation className="text-slate-400" size={18} />
                      <div>
                        <div className="font-medium text-slate-900 truncate">{activity.name}</div>
                        <div className="text-xs text-slate-500">{activity.city?.name} • {activity.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
