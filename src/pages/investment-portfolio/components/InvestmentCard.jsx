import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InvestmentCard = ({ investment }) => {
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    })?.format(numAmount);
  };

  const formatPercentage = (percent) => {
    const numPercent = parseFloat(percent) || 0;
    return `${numPercent >= 0 ? '+' : ''}${numPercent.toFixed(2)}%`;
  };

  // Calculate derived values from the investment data
  const currentValue = parseFloat(investment?.current_value) || parseFloat(investment?.amount) || 0;
  const investedAmount = parseFloat(investment?.invested_amount) || parseFloat(investment?.amount) || 0;
  const gainLoss = currentValue - investedAmount;
  const changePercent = investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;
  const quantity = parseFloat(investment?.quantity) || 1;
  const currentPrice = quantity > 0 ? currentValue / quantity : currentValue;

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
          <p className="text-lg font-bold text-card-foreground">{formatCurrency(currentValue)}</p>
          <div className="flex items-center space-x-1">
            <Icon 
              name={changePercent >= 0 ? "ArrowUp" : "ArrowDown"} 
              size={14} 
              className={changePercent >= 0 ? "text-success" : "text-destructive"} 
            />
            <span className={`text-sm font-medium ${
              changePercent >= 0 ? "text-success" : "text-destructive"
            }`}>
              {formatPercentage(changePercent)}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Invested</p>
          <p className="text-sm font-medium text-card-foreground">{formatCurrency(investedAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Gain/Loss</p>
          <p className={`text-sm font-medium ${
            gainLoss >= 0 ? "text-success" : "text-destructive"
          }`}>
            {formatCurrency(gainLoss)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Quantity</p>
          <p className="text-sm font-medium text-card-foreground">{quantity}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current Price</p>
          <p className="text-sm font-medium text-card-foreground">{formatCurrency(currentPrice)}</p>
        </div>
      </div>
      {investment?.type === 'fixed-deposit' && investment?.maturity_date && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Maturity Date</span>
            <span className="text-sm font-medium text-card-foreground">
              {new Date(investment.maturity_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Interest Rate</span>
            <span className="text-sm font-medium text-card-foreground">{investment?.interest_rate || 'N/A'}%</span>
          </div>
        </div>
      )}
      {investment?.type === 'mutual-fund' && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">NAV</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(investment?.nav || currentPrice)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Expense Ratio</span>
            <span className="text-sm font-medium text-card-foreground">{investment?.expense_ratio || 'N/A'}%</span>
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