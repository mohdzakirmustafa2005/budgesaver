
import React, { useState, useMemo } from 'react';
import type { Budget, Transaction } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface BudgetsProps {
    budgets: Budget[];
    transactions: Transaction[];
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    deleteBudget: (id: string) => void;
}

const BudgetCard: React.FC<{ budget: Budget; spent: number; onDelete: () => void }> = ({ budget, spent, onDelete }) => {
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const remaining = budget.limit - spent;

    let progressBarColor = 'bg-green-500';
    if (percentage > 90) {
        progressBarColor = 'bg-red-500';
    } else if (percentage > 70) {
        progressBarColor = 'bg-yellow-500';
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{budget.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Limit: ₹{budget.limit.toFixed(2)}</p>
                </div>
                <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon />
                </button>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    <span>Spent: ₹{spent.toFixed(2)}</span>
                    <span>Remaining: ₹{remaining.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                </div>
            </div>
        </div>
    );
}

const AddBudgetModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (budget: Omit<Budget, 'id'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [color, setColor] = useState('#0088FE');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && limit) {
            onAdd({ name, limit: parseFloat(limit), color });
            setName('');
            setLimit('');
            setColor('#0088FE');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New Budget</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="e.g., Groceries"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Limit</label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="e.g., 5000"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Budget</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Budgets: React.FC<BudgetsProps> = ({ budgets, transactions, addBudget, deleteBudget }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const spendingMap = useMemo(() => {
        const map = new Map<string, number>();
        budgets.forEach(b => map.set(b.id, 0));
        transactions.forEach(t => {
            map.set(t.budgetId, (map.get(t.budgetId) || 0) + t.amount);
        });
        return map;
    }, [budgets, transactions]);

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Budgets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(budget => (
                    <BudgetCard
                        key={budget.id}
                        budget={budget}
                        spent={spendingMap.get(budget.id) || 0}
                        onDelete={() => deleteBudget(budget.id)}
                    />
                ))}
            </div>
            {budgets.length === 0 && (
                 <div className="text-center py-10">
                     <p className="text-gray-500 dark:text-gray-400">You haven't created any budgets yet.</p>
                     <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2 mx-auto">
                        <PlusIcon /> Create Your First Budget
                    </button>
                 </div>
            )}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-20 right-5 md:bottom-10 md:right-10 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110 z-40">
                <PlusIcon className="w-8 h-8" />
            </button>
            <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addBudget} />
        </div>
    );
};
