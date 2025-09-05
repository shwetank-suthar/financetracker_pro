import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';

const SpendingCharts = ({ expenses }) => {
  const [activeChart, setActiveChart] = useState('category');
  const [timeRange, setTimeRange] = useState('month');

  const chartTypes = [
    { value: 'category', label: 'By Category' },
    { value: 'daily', label: 'Daily Trend' },
    { value: 'monthly', label: 'Monthly Overview' }
  ];

  const timeRanges = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' }
  ];

  const colors = [
    '#1E40AF', '#6366F1', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
  ];

  // Filter expenses based on time range
  const getFilteredExpenses = () => {
    const now = new Date();
    const ranges = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    };
    
    const daysBack = ranges?.[timeRange] || 30;
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return expenses?.filter(expense => new Date(expense.date) >= cutoffDate);
  };

  // Category breakdown data
  const getCategoryData = () => {
    const filteredExpenses = getFilteredExpenses();
    const categoryTotals = {};
    
    filteredExpenses?.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals?.[expense?.category] || 0) + expense?.amount;
    });
    
    return Object.entries(categoryTotals)?.map(([category, amount]) => ({
        category: category?.charAt(0)?.toUpperCase() + category?.slice(1),
        amount: amount,
        percentage: ((amount / filteredExpenses?.reduce((sum, e) => sum + e?.amount, 0)) * 100)?.toFixed(1)
      }))?.sort((a, b) => b?.amount - a?.amount);
  };

  // Daily spending trend
  const getDailyData = () => {
    const filteredExpenses = getFilteredExpenses();
    const dailyTotals = {};
    
    filteredExpenses?.forEach(expense => {
      const date = expense?.date;
      dailyTotals[date] = (dailyTotals?.[date] || 0) + expense?.amount;
    });
    
    return Object.entries(dailyTotals)?.map(([date, amount]) => ({
        date: new Date(date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: amount
      }))?.sort((a, b) => new Date(a.date) - new Date(b.date))?.slice(-14); // Last 14 days
  };

  // Monthly overview
  const getMonthlyData = () => {
    const monthlyTotals = {};
    
    expenses?.forEach(expense => {
      const monthYear = new Date(expense.date)?.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyTotals[monthYear] = (monthlyTotals?.[monthYear] || 0) + expense?.amount;
    });
    
    return Object.entries(monthlyTotals)?.map(([month, amount]) => ({ month, amount }))?.sort((a, b) => new Date(a.month + ' 1') - new Date(b.month + ' 1'))?.slice(-12); // Last 12 months
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          <p className="text-sm text-primary">
            Amount: {formatCurrency(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'category':
        const categoryData = getCategoryData();
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-card-foreground">Category Breakdown</h4>
              {categoryData?.map((item, index) => (
                <div key={item?.category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors?.[index % colors?.length] }}
                    />
                    <span className="text-sm font-medium">{item?.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(item?.amount)}</p>
                    <p className="text-xs text-muted-foreground">{item?.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'daily':
        const dailyData = getDailyData();
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#1E40AF" 
                  strokeWidth={2}
                  dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'monthly':
        const monthlyData = getMonthlyData();
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#1E40AF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  const totalAmount = getFilteredExpenses()?.reduce((sum, expense) => sum + expense?.amount, 0);
  const averageDaily = totalAmount / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Spending Analytics</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={chartTypes}
            value={activeChart}
            onChange={setActiveChart}
            className="w-full sm:w-auto"
            label="Chart Type"
            description="Select the type of chart to display"
            error=""
            id="chart-type-select"
            name="chartType"
          />
          <Select
            options={timeRanges}
            value={timeRange}
            onChange={setTimeRange}
            className="w-full sm:w-auto"
            label="Time Range"
            description="Select the time range for the data"
            error=""
            id="time-range-select"
            name="timeRange"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
        </div>
        
        <div className="bg-secondary/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">Daily Average</span>
          </div>
          <p className="text-2xl font-bold text-secondary">{formatCurrency(averageDaily)}</p>
        </div>
        
        <div className="bg-accent/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Receipt" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-accent">{getFilteredExpenses()?.length}</p>
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default SpendingCharts;