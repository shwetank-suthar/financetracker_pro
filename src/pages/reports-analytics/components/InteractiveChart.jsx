import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';


const InteractiveChart = ({ title, data, type = 'line', height = 300 }) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('6M');

  const chartTypes = [
    { type: 'line', icon: 'TrendingUp', label: 'Line' },
    { type: 'area', icon: 'AreaChart', label: 'Area' },
    { type: 'bar', icon: 'BarChart3', label: 'Bar' },
    { type: 'pie', icon: 'PieChart', label: 'Pie' }
  ];

  const timeRanges = ['1M', '3M', '6M', '1Y', 'ALL'];

  const colors = ['#1E40AF', '#6366F1', '#10B981', '#D97706', '#DC2626'];

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
              }} 
            />
            <Area type="monotone" dataKey="value" stroke={colors?.[0]} fill={colors?.[0]} fillOpacity={0.1} />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
              }} 
            />
            <Bar dataKey="value" fill={colors?.[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors?.[0]} 
              strokeWidth={2}
              dot={{ fill: colors?.[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors?.[0], strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Chart Type Selector */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {chartTypes?.map((chart) => (
              <button
                key={chart?.type}
                onClick={() => setChartType(chart?.type)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                  chartType === chart?.type
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={chart?.icon} size={14} />
                <span className="hidden sm:inline">{chart?.label}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {timeRanges?.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                  timeRange === range
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InteractiveChart;