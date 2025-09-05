import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioOverview = ({ portfolioData }) => {
  const { totalValue, dailyChange, dailyChangePercent, assetAllocation } = portfolioData;

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Portfolio Overview</h3>
          <Icon name="TrendingUp" size={20} className="text-success" />
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-card-foreground">{formatCurrency(totalValue)}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon 
                name={dailyChange >= 0 ? "ArrowUp" : "ArrowDown"} 
                size={16} 
                className={dailyChange >= 0 ? "text-success" : "text-destructive"} 
              />
              <span className={`text-sm font-medium ${dailyChange >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(Math.abs(dailyChange))} ({formatPercentage(dailyChangePercent)})
              </span>
            </div>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
        </div>
      </div>
      {/* Asset Allocation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Asset Allocation</h3>
        <div className="space-y-3">
          {assetAllocation?.map((asset, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: asset?.color }}
                />
                <span className="text-sm text-card-foreground">{asset?.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-card-foreground">{asset?.percentage}%</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(asset?.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;