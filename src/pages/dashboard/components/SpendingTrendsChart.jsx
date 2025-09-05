import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SpendingTrendsChart = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [chartType, setChartType] = useState('line');

  const spendingData = {
    '6months': [
      { month: 'Aug', spending: 3200, income: 4500, savings: 1300 },
      { month: 'Sep', spending: 2800, income: 4500, savings: 1700 },
      { month: 'Oct', spending: 3400, income: 4500, savings: 1100 },
      { month: 'Nov', spending: 3100, income: 4500, savings: 1400 },
      { month: 'Dec', spending: 3800, income: 5200, savings: 1400 },
      { month: 'Jan', spending: 3245, income: 4500, savings: 1255 }
    ],
    '1year': [
      { month: 'Feb 24', spending: 2900, income: 4200, savings: 1300 },
      { month: 'Mar 24', spending: 3100, income: 4200, savings: 1100 },
      { month: 'Apr 24', spending: 2800, income: 4200, savings: 1400 },
      { month: 'May 24', spending: 3300, income: 4500, savings: 1200 },
      { month: 'Jun 24', spending: 3500, income: 4500, savings: 1000 },
      { month: 'Jul 24', spending: 3200, income: 4500, savings: 1300 },
      { month: 'Aug 24', spending: 3200, income: 4500, savings: 1300 },
      { month: 'Sep 24', spending: 2800, income: 4500, savings: 1700 },
      { month: 'Oct 24', spending: 3400, income: 4500, savings: 1100 },
      { month: 'Nov 24', spending: 3100, income: 4500, savings: 1400 },
      { month: 'Dec 24', spending: 3800, income: 5200, savings: 1400 },
      { month: 'Jan 25', spending: 3245, income: 4500, savings: 1255 }
    ]
  };

  const currentData = spendingData?.[timeRange];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const calculateTrend = (data, key) => {
    if (data?.length < 2) return 0;
    const latest = data?.[data?.length - 1]?.[key];
    const previous = data?.[data?.length - 2]?.[key];
    return ((latest - previous) / previous) * 100;
  };

  const spendingTrend = calculateTrend(currentData, 'spending');
  const savingsTrend = calculateTrend(currentData, 'savings');

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Spending Trends</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="xs"
            onClick={() => setChartType('line')}
            iconName="TrendingUp"
          >
            Line
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'outline'}
            size="xs"
            onClick={() => setChartType('area')}
            iconName="BarChart3"
          >
            Area
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant={timeRange === '6months' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('6months')}
        >
          6M
        </Button>
        <Button
          variant={timeRange === '1year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('1year')}
        >
          1Y
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Spending Trend</p>
          <div className="flex items-center justify-center space-x-1">
            <Icon 
              name={spendingTrend >= 0 ? "ArrowUp" : "ArrowDown"} 
              size={16} 
              className={spendingTrend >= 0 ? "text-error" : "text-success"} 
            />
            <span className={`text-lg font-semibold ${spendingTrend >= 0 ? "text-error" : "text-success"}`}>
              {Math.abs(spendingTrend)?.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Savings Trend</p>
          <div className="flex items-center justify-center space-x-1">
            <Icon 
              name={savingsTrend >= 0 ? "ArrowUp" : "ArrowDown"} 
              size={16} 
              className={savingsTrend >= 0 ? "text-success" : "text-error"} 
            />
            <span className={`text-lg font-semibold ${savingsTrend >= 0 ? "text-success" : "text-error"}`}>
              {Math.abs(savingsTrend)?.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value), name]}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="var(--color-error)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-error)', r: 4 }}
                name="Spending"
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', r: 4 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-success)', r: 4 }}
                name="Savings"
              />
            </LineChart>
          ) : (
            <AreaChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value), name]}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1"
                stroke="var(--color-primary)" 
                fill="var(--color-primary)"
                fillOpacity={0.3}
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="spending" 
                stackId="2"
                stroke="var(--color-error)" 
                fill="var(--color-error)"
                fillOpacity={0.3}
                name="Spending"
              />
              <Area 
                type="monotone" 
                dataKey="savings" 
                stackId="3"
                stroke="var(--color-success)" 
                fill="var(--color-success)"
                fillOpacity={0.3}
                name="Savings"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span className="text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded-full" />
          <span className="text-muted-foreground">Spending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full" />
          <span className="text-muted-foreground">Savings</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingTrendsChart;