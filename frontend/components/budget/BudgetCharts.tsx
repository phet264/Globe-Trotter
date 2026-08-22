'use client';

import React, { useState, useEffect } from 'react';
import { budgetApi } from '@/lib/api/budget';
import { BudgetSummary } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = {
  Transport: '#3B82F6', // blue
  Accommodation: '#8B5CF6', // purple
  Activities: '#F59E0B', // amber
  Meals: '#10B981', // emerald
  Other: '#64748B' // slate
};

export default function BudgetCharts({ tripId }: { tripId: string }) {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // We should listen for expense updates to refresh this. 
  // For now, we'll just expose a global window event or fetch it once.
  // In a real app, react-query is ideal here.
  const loadSummary = async () => {
    setIsLoading(true);
    try {
      const data = await budgetApi.getBudgetSummary(tripId);
      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    
    // Listen to custom event for expense changes
    const handleExpenseChange = () => loadSummary();
    window.addEventListener('expense-changed', handleExpenseChange);
    return () => window.removeEventListener('expense-changed', handleExpenseChange);
  }, [tripId]);

  if (isLoading || !summary) {
    return <div className="animate-pulse h-96 bg-slate-200 rounded-xl"></div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${summary.spent.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.remaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              ${summary.remaining.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${
              summary.status === 'Over budget' ? 'text-red-500' : 
              summary.status === 'Near limit' ? 'text-amber-500' : 
              'text-emerald-600'
            }`}>
              {summary.status}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {summary.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.category] || COLORS.Other} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Spending */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Spending</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.dailySpending}>
                <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip formatter={(value: number) => `$${value}`} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
