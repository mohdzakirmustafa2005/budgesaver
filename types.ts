export type View = 'dashboard' | 'budgets' | 'transactions' | 'settings';

export type Theme = 'light' | 'dark';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  budgetId: string;
  accountId: string;
  recurringTransactionId?: string;
}

export interface Budget {
  id:string;
  name: string;
  limit: number;
  color: string;
}

export interface Account {
  id: string;
  name: string; // e.g., 'Main UPI', 'Savings Account'
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  budgetId: string;
  accountId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // ISO string
  endDate?: string; // Optional ISO string
  lastGeneratedDate?: string; // ISO string
}
