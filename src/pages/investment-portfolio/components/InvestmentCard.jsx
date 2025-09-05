import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InvestmentCard = ({ investment }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const formatPercentage = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent?.toFixed(2)}%`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stock':
        return 'TrendingUp';
      case 'mutual-fund':
        return 'BarChart3';
      case 'fixed-deposit':
        return 'Landmark';
      default:
        return 'DollarSign';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'stock':
        return 'text-blue-600';
      case 'mutual-fund':
        return 'text-purple-600';
      case 'fixed-deposit':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-subtle transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {investment?.logo ? (
            <Image
              src={investment?.logo}
              alt={investment?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Icon name={getTypeIcon(investment?.type)} size={20} className={getTypeColor(investment?.type)} />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-card-foreground">{investment?.name}</h3>
            <p className="text-sm text-muted-foreground">{investment?.symbol || investment?.type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-card-foreground">{formatCurrency(investment?.currentValue)}</p>
          <div className="flex items-center space-x-1">
            <Icon 
              name={investment?.changePercent >= 0 ? "ArrowUp" : "ArrowDown"} 
              size={14} 
              className={investment?.changePercent >= 0 ? "text-success" : "text-destructive"} 
            />
            <span className={`text-sm font-medium ${
              investment?.changePercent >= 0 ? "text-success" : "text-destructive"
            }`}>
              {formatPercentage(investment?.changePercent)}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Invested</p>
          <p className="text-sm font-medium text-card-foreground">{formatCurrency(investment?.investedAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Gain/Loss</p>
          <p className={`text-sm font-medium ${
            investment?.gainLoss >= 0 ? "text-success" : "text-destructive"
          }`}>
            {formatCurrency(investment?.gainLoss)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Quantity</p>
          <p className="text-sm font-medium text-card-foreground">{investment?.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current Price</p>
          <p className="text-sm font-medium text-card-foreground">{formatCurrency(investment?.currentPrice)}</p>
        </div>
      </div>
      {investment?.type === 'fixed-deposit' && investment?.maturityDate && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Maturity Date</span>
            <span className="text-sm font-medium text-card-foreground">
              {new Date(investment.maturityDate)?.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Interest Rate</span>
            <span className="text-sm font-medium text-card-foreground">{investment?.interestRate}%</span>
          </div>
        </div>
      )}
      {investment?.type === 'mutual-fund' && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">NAV</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(investment?.nav)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Expense Ratio</span>
            <span className="text-sm font-medium text-card-foreground">{investment?.expenseRatio}%</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <button className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-smooth">
          <Icon name="Eye" size={14} />
          <span>View Details</span>
        </button>
        <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-card-foreground transition-smooth">
          <Icon name="MoreHorizontal" size={14} />
        </button>
      </div>
    </div>
  );
};

export default InvestmentCard;