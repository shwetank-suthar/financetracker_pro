import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialHealthScore = () => {
  const healthScore = 78;
  const insights = [
    "Your spending is 12% below budget this month",
    "Emergency fund is 85% complete",
    "Investment portfolio shows 8.5% growth"
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Financial Health Score</h3>
        <Icon name="TrendingUp" size={20} className="text-primary" />
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <div className={`relative w-20 h-20 rounded-full ${getScoreBackground(healthScore)} flex items-center justify-center`}>
          <span className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>
            {healthScore}
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Overall Score</p>
          <p className={`text-lg font-semibold ${getScoreColor(healthScore)}`}>
            {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-card-foreground">AI Insights</h4>
        {insights?.map((insight, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialHealthScore;