import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';
import SpendingCharts from './components/SpendingCharts';
import AIInsights from './components/AIInsights';
import ExportOptions from './components/ExportOptions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingExpense, setEditingExpense] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockExpenses = [
      {
        id: 1,
        amount: 45.50,
        category: 'food',
        description: 'Lunch at Italian restaurant',
        date: '2025-01-04',
        tags: ['work', 'lunch'],
        createdAt: '2025-01-04T12:30:00Z'
      },
      {
        id: 2,
        amount: 85.00,
        category: 'groceries',
        description: 'Weekly grocery shopping at Whole Foods',
        date: '2025-01-03',
        tags: ['weekly', 'essentials'],
        createdAt: '2025-01-03T18:45:00Z'
      },
      {
        id: 3,
        amount: 25.00,
        category: 'transportation',
        description: 'Uber ride to airport',
        date: '2025-01-02',
        tags: ['travel', 'business'],
        createdAt: '2025-01-02T08:15:00Z'
      },
      {
        id: 4,
        amount: 120.00,
        category: 'entertainment',
        description: 'Movie tickets and dinner',
        date: '2025-01-01',
        tags: ['date', 'weekend'],
        createdAt: '2025-01-01T19:30:00Z'
      },
      {
        id: 5,
        amount: 65.75,
        category: 'bills',
        description: 'Internet bill payment',
        date: '2024-12-31',
        tags: ['monthly', 'utilities'],
        createdAt: '2024-12-31T10:00:00Z'
      },
      {
        id: 6,
        amount: 32.40,
        category: 'healthcare',
        description: 'Pharmacy prescription pickup',
        date: '2024-12-30',
        tags: ['health', 'medication'],
        createdAt: '2024-12-30T14:20:00Z'
      },
      {
        id: 7,
        amount: 150.00,
        category: 'shopping',
        description: 'New winter jacket',
        date: '2024-12-29',
        tags: ['clothing', 'winter'],
        createdAt: '2024-12-29T16:45:00Z'
      },
      {
        id: 8,
        amount: 18.50,
        category: 'food',
        description: 'Coffee and pastry',
        date: '2024-12-28',
        tags: ['coffee', 'morning'],
        createdAt: '2024-12-28T09:15:00Z'
      }
    ];

    setExpenses(mockExpenses);
    setFilteredExpenses(mockExpenses);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'insights', label: 'AI Insights', icon: 'Brain' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  const handleAddExpense = (newExpense) => {
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    setFilteredExpenses(updatedExpenses);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    // In a real app, this would open an edit modal
    console.log('Edit expense:', expense);
  };

  const handleDeleteExpense = (expenseId) => {
    const updatedExpenses = expenses?.filter(expense => expense?.id !== expenseId);
    setExpenses(updatedExpenses);
    setFilteredExpenses(updatedExpenses);
  };

  const handleBulkAction = (action, selectedIds) => {
    if (action === 'delete') {
      const updatedExpenses = expenses?.filter(expense => !selectedIds?.includes(expense?.id));
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
    }
  };

  const handleFiltersChange = (filters) => {
    let filtered = [...expenses];

    // Search filter
    if (filters?.search) {
      filtered = filtered?.filter(expense =>
        expense?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        expense?.category?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Category filter
    if (filters?.category) {
      filtered = filtered?.filter(expense => expense?.category === filters?.category);
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(expense => expense?.date >= filters?.dateFrom);
    }
    if (filters?.dateTo) {
      filtered = filtered?.filter(expense => expense?.date <= filters?.dateTo);
    }

    // Amount range filter
    if (filters?.minAmount) {
      filtered = filtered?.filter(expense => expense?.amount >= parseFloat(filters?.minAmount));
    }
    if (filters?.maxAmount) {
      filtered = filtered?.filter(expense => expense?.amount <= parseFloat(filters?.maxAmount));
    }

    // Tags filter
    if (filters?.tags) {
      const searchTags = filters?.tags?.toLowerCase()?.split(',')?.map(tag => tag?.trim());
      filtered = filtered?.filter(expense =>
        expense?.tags?.some(tag =>
          searchTags?.some(searchTag => tag?.toLowerCase()?.includes(searchTag))
        )
      );
    }

    setFilteredExpenses(filtered);
  };

  const totalExpenses = filteredExpenses?.reduce((sum, expense) => sum + expense?.amount, 0);
  const monthlyExpenses = filteredExpenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate?.getMonth() === now?.getMonth() && expenseDate?.getFullYear() === now?.getFullYear();
  });
  const monthlyTotal = monthlyExpenses?.reduce((sum, expense) => sum + expense?.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })?.format(totalExpenses)}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-secondary" />
                <span className="text-sm font-medium text-muted-foreground">This Month</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })?.format(monthlyTotal)}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Receipt" size={16} className="text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Transactions</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{filteredExpenses?.length}</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-warning" />
                <span className="text-sm font-medium text-muted-foreground">Avg/Day</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })?.format(monthlyTotal / 30)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Expense Form */}
          <ExpenseForm onAddExpense={handleAddExpense} />

          {/* Navigation Tabs */}
          <div className="bg-card rounded-lg border border-border p-1 shadow-subtle">
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
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <ExpenseFilters 
                onFiltersChange={handleFiltersChange}
                totalExpenses={expenses?.length}
              />
              <ExpenseTable
                expenses={filteredExpenses}
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense}
                onBulkAction={handleBulkAction}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <SpendingCharts expenses={filteredExpenses} />
          )}

          {activeTab === 'insights' && (
            <AIInsights expenses={filteredExpenses} />
          )}

          {activeTab === 'export' && (
            <ExportOptions expenses={filteredExpenses} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracking;