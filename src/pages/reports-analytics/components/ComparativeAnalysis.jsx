import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const ComparativeAnalysis = () => {
  const [comparisonType, setComparisonType] = useState('year_over_year');
  const [selectedMetric, setSelectedMetric] = useState('spending');

  const comparisonOptions = [
    { value: 'year_over_year', label: 'Year over Year' },
    { value: 'month_over_month', label: 'Month over Month' },
    { value: 'quarter_over_quarter', label: 'Quarter over Quarter' },
    { value: 'benchmark', label: 'vs Benchmark' }
  ];

  const metricOptions = [
    { value: 'spending', label: 'Total Spending' },
    { value: 'income', label: 'Income' },
    { value: 'savings', label: 'Savings Rate' },
    { value: 'investments', label: 'Investment Returns' },
    { value: 'net_worth', label: 'Net Worth' }
  ];

  const yearOverYearData = [
    { month: 'Jan', current: 3200, previous: 2800, benchmark: 3000 },
    { month: 'Feb', current: 2900, previous: 3100, benchmark: 3000 },
    { month: 'Mar', current: 3400, previous: 2900, benchmark: 3000 },
    { month: 'Apr', current: 3100, previous: 3200, benchmark: 3000 },
    { month: 'May', current: 3600, previous: 3000, benchmark: 3000 },
    { month: 'Jun', current: 3300, previous: 3400, benchmark: 3000 },
    { month: 'Jul', current: 3500, previous: 3100, benchmark: 3000 },
    { month: 'Aug', current: 3200, previous: 3300, benchmark: 3000 },
    { month: 'Sep', current: 3400, previous: 2900, benchmark: 3000 },
    { month: 'Oct', current: 3100, previous: 3200, benchmark: 3000 },
    { month: 'Nov', current: 3600, previous: 3500, benchmark: 3000 },
    { month: 'Dec', current: 3800, previous: 3600, benchmark: 3000 }
  ];

  const categoryComparison = [
    { category: 'Food & Dining', current: 847, previous: 584, change: 45.0, changeType: 'increase' },
    { category: 'Transportation', current: 320, previous: 380, change: -15.8, changeType: 'decrease' },
    { category: 'Shopping', current: 650, previous: 720, change: -9.7, changeType: 'decrease' },
    { category: 'Entertainment', current: 280, previous: 240, change: 16.7, changeType: 'increase' },
    { category: 'Bills & Utilities', current: 450, previous: 445, change: 1.1, changeType: 'increase' },
    { category: 'Healthcare', current: 180, previous: 220, change: -18.2, changeType: 'decrease' }
  ];

  const benchmarkData = [
    { metric: 'Savings Rate', your: 22, benchmark: 20, status: 'above' },
    { metric: 'Debt-to-Income', your: 15, benchmark: 28, status: 'above' },
    { metric: 'Emergency Fund', your: 6.2, benchmark: 3.0, status: 'above' },
    { metric: 'Investment Allocation', your: 75, benchmark: 70, status: 'above' },
    { metric: 'Monthly Expenses', your: 3200, benchmark: 3500, status: 'above' }
  ];

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-destructive' : 'text-success';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'increase' ? 'TrendingUp' : 'TrendingDown';
  };

  const getBenchmarkStatus = (status) => {
    return status === 'above' ? 'text-success' : 'text-destructive';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Comparative Analysis</h3>
              <p className="text-sm text-muted-foreground">Compare your financial performance over time</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Select
              options={comparisonOptions}
              value={comparisonType}
              onChange={setComparisonType}
              className="w-48"
              label=""
              description=""
              error=""
              id="comparison-type"
              name="comparisonType"
            />
            <Select
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
              className="w-40"
              label=""
              description=""
              error=""
              id="selected-metric"
              name="selectedMetric"
            />
          </div>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Trend Chart */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4">Trend Comparison</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearOverYearData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#1E40AF" 
                  strokeWidth={2}
                  name="2025"
                  dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  name="2024"
                  dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                />
                {comparisonType === 'benchmark' && (
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Benchmark"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4">Category Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryComparison?.map((category) => (
              <div key={category?.category} className="bg-muted/50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-2">{category?.category}</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Current</span>
                    <span className="text-sm font-semibold text-foreground">${category?.current}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Previous</span>
                    <span className="text-sm text-muted-foreground">${category?.previous}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Change</span>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={getChangeIcon(category?.changeType)} 
                        size={12} 
                        className={getChangeColor(category?.changeType)} 
                      />
                      <span className={`text-sm font-medium ${getChangeColor(category?.changeType)}`}>
                        {Math.abs(category?.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4">Benchmark Comparison</h4>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benchmarkData?.map((item) => (
                <div key={item?.metric} className="text-center">
                  <h5 className="text-sm font-medium text-foreground mb-2">{item?.metric}</h5>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {item?.metric?.includes('Rate') || item?.metric?.includes('Fund') ? `${item?.your}%` : 
                       item?.metric?.includes('Expenses') ? `$${item?.your}` : `${item?.your}%`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {item?.metric?.includes('Rate') || item?.metric?.includes('Fund') ? `${item?.benchmark}%` : 
                          item?.metric?.includes('Expenses') ? `$${item?.benchmark}` : `${item?.benchmark}%`} benchmark
                    </div>
                    <div className={`text-xs font-medium ${getBenchmarkStatus(item?.status)}`}>
                      {item?.status === 'above' ? '✓ Above Average' : '⚠ Below Average'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;