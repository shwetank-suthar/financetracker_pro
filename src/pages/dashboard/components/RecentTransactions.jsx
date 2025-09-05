import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const RecentTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    {
      id: 1,
      description: 'Starbucks Coffee',
      category: 'Food & Dining',
      amount: -5.75,
      date: '2025-09-05',
      type: 'expense',
      icon: 'Coffee'
    },
    {
      id: 2,
      description: 'Salary Deposit',
      category: 'Income',
      amount: 3500.00,
      date: '2025-09-01',
      type: 'income',
      icon: 'DollarSign'
    },
    {
      id: 3,
      description: 'Uber Ride',
      category: 'Transportation',
      amount: -12.50,
      date: '2025-09-04',
      type: 'expense',
      icon: 'Car'
    },
    {
      id: 4,
      description: 'Amazon Purchase',
      category: 'Shopping',
      amount: -89.99,
      date: '2025-09-03',
      type: 'expense',
      icon: 'ShoppingBag'
    },
    {
      id: 5,
      description: 'Netflix Subscription',
      category: 'Entertainment',
      amount: -15.99,
      date: '2025-09-02',
      type: 'expense',
      icon: 'Play'
    },
    {
      id: 6,
      description: 'Freelance Payment',
      category: 'Income',
      amount: 750.00,
      date: '2025-09-01',
      type: 'income',
      icon: 'Briefcase'
    }
  ];

  const filteredTransactions = transactions?.filter(transaction =>
    transaction?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    transaction?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (type) => {
    return type === 'income' ? 'text-success' : 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Transactions</h3>
        <Icon name="Receipt" size={20} className="text-primary" />
      </div>
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredTransactions?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          filteredTransactions?.map((transaction) => (
            <div key={transaction?.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-smooth">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction?.type === 'income' ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  <Icon 
                    name={transaction?.icon} 
                    size={18} 
                    className={transaction?.type === 'income' ? 'text-success' : 'text-error'} 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {transaction?.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction?.category} • {formatDate(transaction?.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${getCategoryColor(transaction?.type)}`}>
                  {transaction?.type === 'income' ? '+' : '-'}{formatCurrency(transaction?.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredTransactions?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 transition-smooth">
            View All Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;