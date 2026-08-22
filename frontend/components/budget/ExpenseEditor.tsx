'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { budgetApi } from '@/lib/api/budget';
import { Expense, ExpenseCategory } from '@/lib/api/types';
import { z } from 'zod';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.enum(['Transport', 'Accommodation', 'Activities', 'Meals', 'Other']),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
});

interface ExpenseEditorProps {
  tripId: string;
  expense: Expense | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ExpenseEditor({ tripId, expense, onClose, onSave }: ExpenseEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    amount: expense?.amount || 0,
    category: expense?.category || 'Other' as ExpenseCategory,
    description: expense?.description || '',
    date: expense?.date || new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, category: value as ExpenseCategory }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate
      const validData = expenseSchema.parse(formData);
      setErrors({});
      
      setIsSaving(true);
      if (expense) {
        await budgetApi.updateExpense(expense.id, validData);
      } else {
        await budgetApi.addExpense({ ...validData, tripId });
      }
      onSave();
      onClose();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldErrors: any = {};
        error.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error('Failed to save expense', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount ($)</Label>
            <div className="col-span-3">
              <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <div className="col-span-3">
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Accommodation">Accommodation</SelectItem>
                  <SelectItem value="Activities">Activities</SelectItem>
                  <SelectItem value="Meals">Meals</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <div className="col-span-3">
              <Input id="description" name="description" value={formData.description} onChange={handleChange} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <div className="col-span-3">
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
