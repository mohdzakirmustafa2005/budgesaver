
import React from 'react';
import type { View } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { BudgetIcon } from './icons/BudgetIcon';
import { TransactionIcon } from './icons/TransactionIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface BottomNavProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    const activeClasses = 'text-primary-600 dark:text-primary-400';
    const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400';
    return (
        <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 space-y-1 transition-colors duration-200">
            <div className={`${isActive ? activeClasses : inactiveClasses}`}>{icon}</div>
            <span className={`text-xs font-medium ${isActive ? activeClasses : inactiveClasses}`}>{label}</span>
        </button>
    );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
            <div className="flex justify-around items-center h-full">
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
            </div>
        </div>
    );
};
