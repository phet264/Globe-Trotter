'use client';

import React, { useState, useEffect } from 'react';
import { budgetApi } from '@/lib/api/budget';
import { Expense } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import ExpenseEditor from './ExpenseEditor';

export default function ExpenseList({ tripId }: { tripId: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await budgetApi.getExpenses(tripId);
      setExpenses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [tripId]);

  const handleSave = () => {
    loadExpenses();
    window.dispatchEvent(new Event('expense-changed'));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await budgetApi.deleteExpense(id);
      handleSave();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-slate-200 rounded-xl"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Expenses</h2>
        <Button onClick={() => { setEditingExpense(null); setIsEditorOpen(true); }} size="sm">
          + Add
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {expenses.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No expenses logged yet.</p>
        ) : (
          expenses.map(expense => (
            <div key={expense.id} className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50 group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-slate-900">{expense.description}</h3>
                  <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{expense.category}</span>
                </div>
                <div className="font-bold text-slate-900">${expense.amount}</div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                <span className="text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingExpense(expense); setIsEditorOpen(true); }} className="h-8 px-2">Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)} className="h-8 px-2 text-red-500 hover:text-red-600">Delete</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isEditorOpen && (
        <ExpenseEditor 
          tripId={tripId}
          expense={editingExpense} 
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
