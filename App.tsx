import React, { useState, useEffect } from 'react';
import type { View, Theme, Transaction, Budget, Account, RecurringTransaction } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './components/Dashboard';
import { Budgets } from './components/Budgets';
import { Transactions } from './components/Transactions';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { BudgetIcon } from './components/icons/BudgetIcon';
import { TransactionIcon } from './components/icons/TransactionIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';

const SideNav: React.FC<{ activeView: View; setActiveView: (view: View) => void }> = ({ activeView, setActiveView }) => {
    const NavItem: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, icon, isActive, onClick }) => {
        const baseClasses = "flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200";
        const activeClasses = "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300";
        const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
        return (
            <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <div className="mr-3">{icon}</div>
                {label}
            </button>
        );
    };

    return (
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 px-4 py-2 mb-4">BudgetSaver</h1>
             <NavItem
                label="Dashboard"
                icon={<DashboardIcon />}
                isActive={activeView === 'dashboard'}
                onClick={() => setActiveView('dashboard')}
            />
            <NavItem
                label="Budgets"
                icon={<BudgetIcon />}
                isActive={activeView === 'budgets'}
                onClick={() => setActiveView('budgets')}
            />
            <NavItem
                label="Transactions"
                icon={<TransactionIcon />}
                isActive={activeView === 'transactions'}
                onClick={() => setActiveView('transactions')}
            />
            <NavItem
                label="Settings"
                icon={<SettingsIcon />}
                isActive={activeView === 'settings'}
                onClick={() => setActiveView('settings')}
            />
        </aside>
    );
};


function App() {
  const [activeView, setActiveView] = useLocalStorage<View>('budgetsaver-view', 'dashboard');
  const [theme, setTheme] = useLocalStorage<Theme>('budgetsaver-theme', 'light');

  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('budgetsaver-transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgetsaver-budgets', []);
  const [accounts, setAccounts] = useLocalStorage<Account[]>('budgetsaver-accounts', []);
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage<RecurringTransaction[]>('budgetsaver-recurring-transactions', []);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Effect to generate recurring transactions on app load
  useEffect(() => {
    const now = new Date();
    const newTransactions: Transaction[] = [];
    const updatedRecurringTransactions = recurringTransactions.map(rt => {
      const recurringTransaction = { ...rt };
      let cursorDate = recurringTransaction.lastGeneratedDate 
        ? new Date(recurringTransaction.lastGeneratedDate) 
        // Start from day before to include start date in the first check
        : new Date(new Date(recurringTransaction.startDate).setDate(new Date(recurringTransaction.startDate).getDate() - 1));

      while (true) {
        let nextDate = new Date(cursorDate);
        switch (recurringTransaction.frequency) {
            case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
            case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
            case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
            case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
        }

        if (nextDate > now) break; // Next date is in the future
        
        if (recurringTransaction.endDate && nextDate > new Date(recurringTransaction.endDate)) break; // Past the end date
        
        newTransactions.push({
            id: `${recurringTransaction.id}-${nextDate.getTime()}`,
            description: recurringTransaction.description,
            amount: recurringTransaction.amount,
            date: nextDate.toISOString(),
            budgetId: recurringTransaction.budgetId,
            accountId: recurringTransaction.accountId,
            recurringTransactionId: recurringTransaction.id,
        });

        recurringTransaction.lastGeneratedDate = nextDate.toISOString();
        cursorDate = nextDate;
      }
      return recurringTransaction;
    });

    if (newTransactions.length > 0) {
      setTransactions(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const uniqueNewTransactions = newTransactions.filter(t => !existingIds.has(t.id));
        if (uniqueNewTransactions.length === 0) return prev;
        return [...prev, ...uniqueNewTransactions];
      });
      setRecurringTransactions(updatedRecurringTransactions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data manipulation functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString() }]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => [...prev, { ...budget, id: Date.now().toString() }]);
  };

  const deleteBudget = (id: string) => {
    // Also delete associated transactions to prevent orphans
    setTransactions(prev => prev.filter(t => t.budgetId !== id));
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const addAccount = (account: Omit<Account, 'id'>) => {
    setAccounts(prev => [...prev, { ...account, id: Date.now().toString() }]);
  };

  const deleteAccount = (id: string) => {
    // Also delete associated transactions to prevent orphans
    setTransactions(prev => prev.filter(t => t.accountId !== id));
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addRecurringTransaction = (recTransaction: Omit<RecurringTransaction, 'id' | 'lastGeneratedDate'>) => {
    setRecurringTransactions(prev => [...prev, { ...recTransaction, id: Date.now().toString() }]);
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(rt => rt.id !== id));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard budgets={budgets} transactions={transactions} />;
      case 'budgets':
        return <Budgets budgets={budgets} transactions={transactions} addBudget={addBudget} deleteBudget={deleteBudget} />;
      case 'transactions':
        return <Transactions 
                    transactions={transactions} 
                    budgets={budgets} 
                    accounts={accounts} 
                    addTransaction={addTransaction} 
                    deleteTransaction={deleteTransaction}
                    recurringTransactions={recurringTransactions}
                    addRecurringTransaction={addRecurringTransaction}
                    deleteRecurringTransaction={deleteRecurringTransaction}
                />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} accounts={accounts} addAccount={addAccount} deleteAccount={deleteAccount} />;
      default:
        return <Dashboard budgets={budgets} transactions={transactions} />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans`}>
        <SideNav activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {renderContent()}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}

export default App;
