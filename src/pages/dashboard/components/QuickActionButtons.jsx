import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActionButtons = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Add Expense',
      icon: 'Plus',
      variant: 'default',
      action: () => navigate('/expense-tracking')
    },
    {
      label: 'View Portfolio',
      icon: 'TrendingUp',
      variant: 'outline',
      action: () => navigate('/investment-portfolio')
    },
    {
      label: 'Generate Report',
      icon: 'FileText',
      variant: 'outline',
      action: () => navigate('/reports-analytics')
    },
    {
      label: 'Set Budget',
      icon: 'Target',
      variant: 'outline',
      action: () => console.log('Set budget clicked')
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant}
            onClick={action?.action}
            iconName={action?.icon}
            iconPosition="left"
            fullWidth
            className="justify-start"
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;