import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceChart = ({ data, timeRange, onTimeRangeChange }) => {
  const timeRanges = [
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '3M', label: '3M' },
    { id: '6M', label: '6M' },
    { id: '1Y', label: '1Y' },
    { id: 'ALL', label: 'ALL' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm text-popover-foreground font-medium">{label}</p>
          <p className="text-sm text-primary">
            Portfolio Value: {formatCurrency(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Portfolio Performance</h3>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {timeRanges?.map((range) => (
            <button
              key={range?.id}
              onClick={() => onTimeRangeChange(range?.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-smooth ${
                timeRange === range?.id
                  ? 'bg-card text-card-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-card-foreground'
              }`}
            >
              {range?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "var(--color-primary)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;