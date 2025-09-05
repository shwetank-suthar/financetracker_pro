import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const MonthlySpendingSummary = () => {
  const currentMonth = new Date()?.toLocaleString('default', { month: 'long' });
  const totalSpent = 3245.80;
  const budgetLimit = 4000.00;
  const percentageUsed = (totalSpent / budgetLimit) * 100;

  const spendingData = [
    { category: 'Food', amount: 850, budget: 1000 },
    { category: 'Transport', amount: 420, budget: 500 },
    { category: 'Shopping', amount: 680, budget: 800 },
    { category: 'Bills', amount: 1295.80, budget: 1200 },
    { category: 'Entertainment', amount: 0, budget: 500 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{currentMonth} Spending</h3>
        <Icon name="BarChart3" size={20} className="text-primary" />
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(totalSpent)} / {formatCurrency(budgetLimit)}
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentageUsed)}`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {percentageUsed?.toFixed(1)}% of budget used
        </p>
      </div>
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spendingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value), 'Amount']}
              labelStyle={{ color: 'var(--color-foreground)' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {spendingData?.map((item, index) => {
          const categoryPercentage = (item?.amount / item?.budget) * 100;
          return (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item?.category}</span>
              <div className="flex items-center space-x-2">
                <span className="text-card-foreground">{formatCurrency(item?.amount)}</span>
                <span className={`text-xs ${categoryPercentage > 100 ? 'text-error' : 'text-muted-foreground'}`}>
                  ({categoryPercentage?.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlySpendingSummary;