import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetProgressCard = () => {
  const budgets = [
    {
      id: 1,
      category: 'Food & Dining',
      spent: 850,
      budget: 1000,
      icon: 'UtensilsCrossed',
      color: 'success'
    },
    {
      id: 2,
      category: 'Transportation',
      spent: 420,
      budget: 500,
      icon: 'Car',
      color: 'success'
    },
    {
      id: 3,
      category: 'Shopping',
      spent: 680,
      budget: 800,
      icon: 'ShoppingBag',
      color: 'warning'
    },
    {
      id: 4,
      category: 'Bills & Utilities',
      spent: 1295.80,
      budget: 1200,
      icon: 'Receipt',
      color: 'error'
    },
    {
      id: 5,
      category: 'Entertainment',
      spent: 0,
      budget: 500,
      icon: 'Play',
      color: 'success'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusIcon = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { name: 'AlertTriangle', color: 'text-error' };
    if (percentage >= 80) return { name: 'AlertCircle', color: 'text-warning' };
    return { name: 'CheckCircle', color: 'text-success' };
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Budget Progress</h3>
        <Icon name="Target" size={20} className="text-primary" />
      </div>
      <div className="space-y-4">
        {budgets?.map((budget) => {
          const percentage = getProgressPercentage(budget?.spent, budget?.budget);
          const statusIcon = getStatusIcon(budget?.spent, budget?.budget);
          
          return (
            <div key={budget?.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name={budget?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">
                    {budget?.category}
                  </span>
                  <Icon name={statusIcon?.name} size={14} className={statusIcon?.color} />
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-card-foreground">
                    {formatCurrency(budget?.spent)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{formatCurrency(budget?.budget)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(budget?.spent, budget?.budget)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{percentage?.toFixed(1)}% used</span>
                <span>
                  {budget?.budget - budget?.spent > 0 
                    ? `${formatCurrency(budget?.budget - budget?.spent)} remaining`
                    : `${formatCurrency(budget?.spent - budget?.budget)} over budget`
                  }
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-smooth">
          Manage Budgets
        </button>
      </div>
    </div>
  );
};

export default BudgetProgressCard;