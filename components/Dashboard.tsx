
import React, { useMemo } from 'react';
import type { Budget, Transaction } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    budgets: Budget[];
    transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Dashboard: React.FC<DashboardProps> = ({ budgets, transactions }) => {
    
    const { totalSpent, totalBudget, spendingByBudget } = useMemo(() => {
        const spendingMap = new Map<string, { name: string; value: number; color: string }>();
        budgets.forEach(b => spendingMap.set(b.id, { name: b.name, value: 0, color: b.color }));
        
        let totalSpent = 0;
        transactions.forEach(t => {
            totalSpent += t.amount;
            if (spendingMap.has(t.budgetId)) {
                const budgetData = spendingMap.get(t.budgetId)!;
                budgetData.value += t.amount;
            }
        });

        const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);

        return {
            totalSpent,
            totalBudget,
            spendingByBudget: Array.from(spendingMap.values()).filter(d => d.value > 0),
        };
    }, [budgets, transactions]);
    
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const getBudgetName = (id: string) => budgets.find(b => b.id === id)?.name || 'Uncategorized';

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Spent (This Month)</h3>
                    <p className="text-3xl font-bold text-red-500 mt-1">₹{totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Budget</h3>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">₹{totalBudget.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Remaining</h3>
                    <p className="text-3xl font-bold text-green-500 mt-1">₹{(totalBudget - totalSpent).toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Spending by Category</h3>
                    {spendingByBudget.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={spendingByBudget}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {spendingByBudget.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                           No spending data to display.
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Transactions</h3>
                    <ul className="space-y-3">
                        {recentTransactions.length > 0 ? recentTransactions.map(t => (
                            <li key={t.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-200">{t.description}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{getBudgetName(t.budgetId)}</p>
                                </div>
                                <p className="font-bold text-red-500">-₹{t.amount.toFixed(2)}</p>
                            </li>
                        )) : <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};
