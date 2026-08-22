import { BudgetSummary, Expense, ExpenseCategory } from './types';

// Mock Backend Storage for Expenses
let MOCK_EXPENSES: Expense[] = [
  { id: 'exp-1', tripId: '1', amount: 500, category: 'Transport', description: 'Flight to Paris', date: '2026-09-10' },
  { id: 'exp-2', tripId: '1', amount: 200, category: 'Accommodation', description: 'Hotel in Paris', date: '2026-09-12' },
  { id: 'exp-3', tripId: '1', amount: 80, category: 'Meals', description: 'Dinner at Le Jules Verne', date: '2026-09-13' },
  { id: 'exp-4', tripId: '1', amount: 50, category: 'Activities', description: 'Louvre Museum Tickets', date: '2026-09-14' },
];

const MOCK_TOTAL_BUDGET = 2000;
const MOCK_TRIP_DAYS = 7; // Example

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const budgetApi = {
  getExpenses: async (tripId: string): Promise<Expense[]> => {
    await delay(300);
    return MOCK_EXPENSES.filter(e => e.tripId === tripId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  addExpense: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
    await delay(400);
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`
    };
    MOCK_EXPENSES.push(newExpense);
    return newExpense;
  },

  updateExpense: async (id: string, data: Partial<Expense>): Promise<Expense> => {
    await delay(400);
    const index = MOCK_EXPENSES.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    MOCK_EXPENSES[index] = { ...MOCK_EXPENSES[index], ...data };
    return MOCK_EXPENSES[index];
  },

  deleteExpense: async (id: string): Promise<void> => {
    await delay(300);
    MOCK_EXPENSES = MOCK_EXPENSES.filter(e => e.id !== id);
  },

  // Authoritative Backend calculation for Budget Summary
  getBudgetSummary: async (tripId: string): Promise<BudgetSummary> => {
    await delay(500);
    const tripExpenses = MOCK_EXPENSES.filter(e => e.tripId === tripId);
    
    const spent = tripExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = MOCK_TOTAL_BUDGET - spent;
    const dailyAverage = spent / (MOCK_TRIP_DAYS || 1);
    
    let status: BudgetSummary['status'] = 'On track';
    const percentSpent = spent / MOCK_TOTAL_BUDGET;
    if (percentSpent < 0.7) status = 'Under budget';
    else if (percentSpent < 0.9) status = 'On track';
    else if (percentSpent <= 1.0) status = 'Near limit';
    else status = 'Over budget';

    const categoryMap: Record<string, number> = {};
    tripExpenses.forEach(exp => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: spent > 0 ? (amount / spent) * 100 : 0
    }));

    const dailyMap: Record<string, number> = {};
    tripExpenses.forEach(exp => {
      dailyMap[exp.date] = (dailyMap[exp.date] || 0) + exp.amount;
    });

    const dailySpending = Object.entries(dailyMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalBudget: MOCK_TOTAL_BUDGET,
      spent,
      remaining,
      dailyAverage,
      status,
      categoryBreakdown,
      dailySpending
    };
  }
};
