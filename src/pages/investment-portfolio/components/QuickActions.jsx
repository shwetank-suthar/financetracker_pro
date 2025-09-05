import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const quickActions = [
    {
      id: 'add-investment',
      label: 'Add Investment',
      icon: 'Plus',
      description: 'Log new stock, mutual fund, or FD',
      action: () => setShowAddModal(true)
    },
    {
      id: 'rebalance',
      label: 'Rebalance Portfolio',
      icon: 'RotateCcw',
      description: 'AI-powered portfolio optimization',
      action: () => console.log('Rebalance portfolio')
    },
    {
      id: 'market-news',
      label: 'Market News',
      icon: 'Newspaper',
      description: 'Latest financial updates',
      action: () => console.log('View market news')
    },
    {
      id: 'performance-report',
      label: 'Generate Report',
      icon: 'FileText',
      description: 'Detailed performance analysis',
      action: () => console.log('Generate report')
    }
  ];

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions?.map((action) => (
            <button
              key={action?.id}
              onClick={action?.action}
              className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-border hover:bg-muted transition-smooth"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={action?.icon} size={20} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-card-foreground">{action?.label}</p>
                <p className="text-xs text-muted-foreground">{action?.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elevated w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground">Add New Investment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-smooth">
                  <Icon name="TrendingUp" size={20} className="text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-card-foreground">Add Stock</p>
                    <p className="text-sm text-muted-foreground">Individual company shares</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-smooth">
                  <Icon name="BarChart3" size={20} className="text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-card-foreground">Add Mutual Fund</p>
                    <p className="text-sm text-muted-foreground">Diversified fund investment</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-smooth">
                  <Icon name="Landmark" size={20} className="text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-card-foreground">Add Fixed Deposit</p>
                    <p className="text-sm text-muted-foreground">Fixed return investment</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;