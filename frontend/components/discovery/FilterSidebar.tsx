'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  isMobileOpen,
  onCloseMobile
}: FilterSidebarProps) {
  
  const content = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Filter size={18} />
          Categories
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === null 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Additional filters like Cost, Duration can go here */}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-6 h-fit sticky top-6 shadow-sm">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="font-display font-bold text-lg">Filters</h2>
              <Button variant="ghost" size="icon" onClick={onCloseMobile}>
                <X size={20} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {content}
            </div>
            <div className="pt-4 mt-auto border-t border-slate-100">
              <Button className="w-full rounded-xl" onClick={onCloseMobile}>Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
