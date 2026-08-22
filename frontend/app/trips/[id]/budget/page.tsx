import React from 'react';
import { notFound } from 'next/navigation';
import { budgetApi } from '@/lib/api/budget';
import BudgetCharts from '@/components/budget/BudgetCharts';
import ExpenseList from '@/components/budget/ExpenseList';

export default async function BudgetPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!id) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-50 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Budget Dashboard</h1>
          <p className="text-slate-500 mt-2">Track your expenses and stay on top of your budget.</p>
        </header>
        
        {/* We use a client component wrapper for data fetching and state so it can be interactive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BudgetCharts tripId={id} />
          </div>
          <div className="lg:col-span-1">
            <ExpenseList tripId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
