
import React, { useState } from 'react';
import type { Theme, Account } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface SettingsProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    accounts: Account[];
    addAccount: (account: Omit<Account, 'id'>) => void;
    deleteAccount: (id: string) => void;
}

const ThemeToggle: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button onClick={toggleTheme} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
            </button>
        </div>
    );
};

export const Settings: React.FC<SettingsProps> = ({ theme, setTheme, accounts, addAccount, deleteAccount }) => {
    const [newAccountName, setNewAccountName] = useState('');

    const handleAddAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAccountName.trim()) {
            addAccount({ name: newAccountName.trim() });
            setNewAccountName('');
        }
    };
    
    return (
        <div className="p-4 md:p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>

            {/* Appearance Settings */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Appearance</h2>
                <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>

            {/* Account Management */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Manage Accounts</h2>
                <form onSubmit={handleAddAccount} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        placeholder="New account name or UPI ID"
                        className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add</button>
                </form>
                <ul className="space-y-2">
                    {accounts.map(account => (
                        <li key={account.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <span className="text-gray-700 dark:text-gray-200">{account.name}</span>
                            <button onClick={() => deleteAccount(account.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <TrashIcon />
                            </button>
                        </li>
                    ))}
                </ul>
                 {accounts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">No accounts added.</p>}
            </div>
        </div>
    );
};
