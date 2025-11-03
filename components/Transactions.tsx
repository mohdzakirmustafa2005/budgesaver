import React, { useState, useMemo } from 'react';
import type { Transaction, Budget, Account, RecurringTransaction } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TransactionsProps {
    transactions: Transaction[];
    budgets: Budget[];
    accounts: Account[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    recurringTransactions: RecurringTransaction[];
    addRecurringTransaction: (recTransaction: Omit<RecurringTransaction, 'id' | 'lastGeneratedDate'>) => void;
    deleteRecurringTransaction: (id: string) => void;
}

const AddTransactionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (transaction: Omit<Transaction, 'id'>) => void;
    budgets: Budget[];
    accounts: Account[];
}> = ({ isOpen, onClose, onAdd, budgets, accounts }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [budgetId, setBudgetId] = useState('');
    const [accountId, setAccountId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description && amount && date && budgetId && accountId) {
            onAdd({
                description,
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
                budgetId,
                accountId
            });
            // Reset form
            setDescription('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setBudgetId('');
            setAccountId('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="e.g., Coffee"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="e.g., 250"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Category</label>
                        <select
                            value={budgetId}
                            onChange={(e) => setBudgetId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        >
                            <option value="" disabled>Select a budget</option>
                            {budgets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account</label>
                        <select
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        >
                            <option value="" disabled>Select an account</option>
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddRecurringTransactionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (recTransaction: Omit<RecurringTransaction, 'id' | 'lastGeneratedDate'>) => void;
    budgets: Budget[];
    accounts: Account[];
}> = ({ isOpen, onClose, onAdd, budgets, accounts }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
    const [budgetId, setBudgetId] = useState('');
    const [accountId, setAccountId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description && amount && startDate && frequency && budgetId && accountId) {
            onAdd({
                description,
                amount: parseFloat(amount),
                startDate: new Date(startDate).toISOString(),
                endDate: endDate ? new Date(endDate).toISOString() : undefined,
                frequency,
                budgetId,
                accountId,
            });
            setDescription('');
            setAmount('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setEndDate('');
            setFrequency('monthly');
            setBudgetId('');
            setAccountId('');
            onClose();
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add Recurring Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Description, Amount, Budget, Account - same as AddTransactionModal */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required min="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
                        <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date (Optional)</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Category</label>
                        <select value={budgetId} onChange={(e) => setBudgetId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                            <option value="" disabled>Select a budget</option>
                            {budgets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account</label>
                        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                            <option value="" disabled>Select an account</option>
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Schedule</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Transactions: React.FC<TransactionsProps> = ({ transactions, budgets, accounts, addTransaction, deleteTransaction, recurringTransactions, addRecurringTransaction, deleteRecurringTransaction }) => {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'history' | 'recurring'>('history');

    const getBudgetName = (id: string) => budgets.find(b => b.id === id)?.name || 'Uncategorized';
    const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown Account';
    
    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: Transaction[] } = {};
        const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        sorted.forEach(t => {
            const date = new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(t);
        });
        return groups;
    }, [transactions]);

    const TabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => {
        const activeClasses = "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300";
        const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500";
        return (
            <button
                onClick={onClick}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${isActive ? activeClasses : inactiveClasses}`}
            >
                {label}
            </button>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Transactions</h1>
            
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton label="History" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                    <TabButton label="Recurring" isActive={activeTab === 'recurring'} onClick={() => setActiveTab('recurring')} />
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'history' && (
                     <div className="space-y-6">
                        {Object.keys(groupedTransactions).length > 0 ? Object.keys(groupedTransactions).map((date) => (
                            <div key={date}>
                                <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2 sticky top-0 bg-gray-100 dark:bg-gray-900 py-2">{date}</h2>
                                <ul className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
                                    {groupedTransactions[date].map(t => (
                                        <li key={t.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-100">{t.description}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{getBudgetName(t.budgetId)} &bull; {getAccountName(t.accountId)}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-bold text-red-500">-₹{t.amount.toFixed(2)}</p>
                                                <button onClick={() => deleteTransaction(t.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )) : (
                             <div className="text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400">You haven't added any transactions yet.</p>
                                <button onClick={() => setIsTransactionModalOpen(true)} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2 mx-auto">
                                    <PlusIcon /> Add Your First Transaction
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'recurring' && (
                    <div>
                        <div className="flex justify-end mb-4">
                             <button onClick={() => setIsRecurringModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">
                                <PlusIcon className="w-5 h-5" /> Add Recurring
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recurringTransactions.length > 0 ? recurringTransactions.map(rt => (
                                <div key={rt.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{rt.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{rt.frequency} &bull; {getBudgetName(rt.budgetId)}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Starts: {new Date(rt.startDate).toLocaleDateString()}
                                            {rt.endDate && ` | Ends: ${new Date(rt.endDate).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div>
                                            <p className="font-bold text-lg text-red-500">-₹{rt.amount.toFixed(2)}</p>
                                        </div>
                                        <button onClick={() => deleteRecurringTransaction(rt.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 dark:text-gray-400">No recurring transactions set up yet.</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add schedules for rent, subscriptions, or salary.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={() => setIsTransactionModalOpen(true)}
                className="fixed bottom-20 right-5 md:bottom-10 md:right-10 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110 z-40">
                <PlusIcon className="w-8 h-8" />
            </button>
            <AddTransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} onAdd={addTransaction} budgets={budgets} accounts={accounts} />
            <AddRecurringTransactionModal isOpen={isRecurringModalOpen} onClose={() => setIsRecurringModalOpen(false)} onAdd={addRecurringTransaction} budgets={budgets} accounts={accounts} />
        </div>
    );
};
