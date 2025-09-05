import React from 'react';
import Icon from '../../../components/AppIcon';

const AccountBalanceCard = () => {
  const accounts = [
    {
      id: 1,
      name: "Checking Account",
      balance: 5420.50,
      type: "checking",
      icon: "CreditCard"
    },
    {
      id: 2,
      name: "Savings Account",
      balance: 12850.75,
      type: "savings",
      icon: "PiggyBank"
    },
    {
      id: 3,
      name: "Investment Account",
      balance: 28340.25,
      type: "investment",
      icon: "TrendingUp"
    }
  ];

  const totalBalance = accounts?.reduce((sum, account) => sum + account?.balance, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Account Balances</h3>
        <Icon name="Wallet" size={20} className="text-primary" />
      </div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Total Balance</p>
        <p className="text-3xl font-bold text-card-foreground">{formatCurrency(totalBalance)}</p>
      </div>
      <div className="space-y-4">
        {accounts?.map((account) => (
          <div key={account?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={account?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">{account?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{account?.type}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-card-foreground">
              {formatCurrency(account?.balance)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBalanceCard;