import React, { useState } from 'react';
import DailyExpenseTracker from './components/DailyExpenseTracker';
import ExpenseForm from './components/ExpenseForm';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';
import SpendingCharts from './components/SpendingCharts';
import AIInsights from './components/AIInsights';
import ExportOptions from './components/ExportOptions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ExpenseTracking = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const tabs = [
    { id: 'daily', label: 'Daily Tracker', icon: 'Calendar' },
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'insights', label: 'AI Insights', icon: 'Brain' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  // These functions are now handled by the DailyExpenseTracker component
  const handleAddExpense = (newExpense) => {
    // Handled by DailyExpenseTracker
  };

  const handleEditExpense = (expense) => {
    // Handled by DailyExpenseTracker
  };

  const handleDeleteExpense = async (expenseId) => {
    // Handled by DailyExpenseTracker
  };

  const handleBulkAction = async (action, selectedIds) => {
    // Handled by DailyExpenseTracker
  };

  const handleFiltersChange = (filters) => {
    // Handled by DailyExpenseTracker
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Icon name="Receipt" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Expense Tracking</h1>
              <p className="text-muted-foreground">
                Log, categorize, and analyze your spending with AI-powered insights
              </p>
            </div>
          </div>

          {/* Quick Stats - Removed until data is properly loaded */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                })?.format(0)}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-secondary" />
                <span className="text-sm font-medium text-muted-foreground">This Month</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                })?.format(0)}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Receipt" size={16} className="text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Transactions</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">0</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-warning" />
                <span className="text-sm font-medium text-muted-foreground">Avg/Day</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                })?.format(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card rounded-lg border border-border p-1 shadow-subtle mb-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab?.id)}
                iconName={tab?.icon}
                iconPosition="left"
                className="flex-shrink-0"
              >
                {tab?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'daily' && (
          <DailyExpenseTracker />
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <ExpenseForm onAddExpense={handleAddExpense} />
            <ExpenseFilters 
              onFiltersChange={handleFiltersChange}
              totalExpenses={0}
            />
            <ExpenseTable
              expenses={[]}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onBulkAction={handleBulkAction}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <SpendingCharts expenses={[]} />
        )}

        {activeTab === 'insights' && (
          <AIInsights expenses={[]} />
        )}

        {activeTab === 'export' && (
          <ExportOptions expenses={[]} />
        )}
    </div>
  );
};

export default ExpenseTracking;