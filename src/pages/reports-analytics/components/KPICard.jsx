import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {trend && (
          <div className="w-16 h-8 bg-muted/50 rounded flex items-center justify-center">
            <Icon name="TrendingUp" size={16} className="text-success" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {change && (
          <div className="flex items-center space-x-1">
            <Icon name={getChangeIcon()} size={14} className={getChangeColor()} />
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;