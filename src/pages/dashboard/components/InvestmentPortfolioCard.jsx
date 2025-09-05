import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const InvestmentPortfolioCard = () => {
  const portfolioValue = 28340.25;
  const dayChange = 245.80;
  const dayChangePercent = 0.87;
  const totalGain = 3420.50;
  const totalGainPercent = 13.7;

  const performanceData = [
    { date: '01/01', value: 24920 },
    { date: '01/08', value: 25180 },
    { date: '01/15', value: 24850 },
    { date: '01/22', value: 26200 },
    { date: '01/29', value: 27100 },
    { date: '02/05', value: 28340 }
  ];

  const holdings = [
    { name: 'S&P 500 ETF', symbol: 'SPY', value: 12500, change: 1.2 },
    { name: 'Tech Growth Fund', symbol: 'TGFX', value: 8900, change: -0.5 },
    { name: 'Apple Inc.', symbol: 'AAPL', value: 4200, change: 2.1 },
    { name: 'Microsoft Corp.', symbol: 'MSFT', value: 2740, change: 0.8 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent?.toFixed(2)}%`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Investment Portfolio</h3>
        <Icon name="TrendingUp" size={20} className="text-primary" />
      </div>
      <div className="mb-6">
        <p className="text-3xl font-bold text-card-foreground mb-1">
          {formatCurrency(portfolioValue)}
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon 
              name={dayChange >= 0 ? "ArrowUp" : "ArrowDown"} 
              size={16} 
              className={dayChange >= 0 ? "text-success" : "text-error"} 
            />
            <span className={`text-sm font-medium ${dayChange >= 0 ? "text-success" : "text-error"}`}>
              {formatCurrency(Math.abs(dayChange))} ({formatPercent(dayChangePercent)})
            </span>
          </div>
          <span className="text-sm text-muted-foreground">Today</span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-muted-foreground">Total Gain: </span>
          <span className="text-sm font-medium text-success">
            {formatCurrency(totalGain)} ({formatPercent(totalGainPercent)})
          </span>
        </div>
      </div>
      <div className="h-32 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip 
              formatter={(value) => [formatCurrency(value), 'Portfolio Value']}
              labelStyle={{ color: 'var(--color-foreground)' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-success)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-card-foreground">Top Holdings</h4>
        {holdings?.map((holding, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">{holding?.symbol}</p>
              <p className="text-xs text-muted-foreground">{holding?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-card-foreground">
                {formatCurrency(holding?.value)}
              </p>
              <p className={`text-xs ${holding?.change >= 0 ? 'text-success' : 'text-error'}`}>
                {formatPercent(holding?.change)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentPortfolioCard;