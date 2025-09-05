import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AlertNotifications = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Budget Alert',
      message: 'Bills & Utilities budget exceeded by $95.80',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionable: true
    },
    {
      id: 2,
      type: 'info',
      title: 'Bill Reminder',
      message: 'Credit card payment due in 3 days ($1,245.50)',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: false,
      actionable: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Goal Milestone',
      message: 'Emergency fund reached 85% of target!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionable: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Investment Update',
      message: 'Monthly investment contribution scheduled for tomorrow',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      actionable: false
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-warning' };
      case 'error':
        return { name: 'XCircle', color: 'text-error' };
      case 'success':
        return { name: 'CheckCircle', color: 'text-success' };
      default:
        return { name: 'Info', color: 'text-primary' };
    }
  };

  const getAlertBackground = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      case 'success':
        return 'bg-success/10 border-success/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const markAsRead = (id) => {
    setAlerts(prev =>
      prev?.map(alert =>
        alert?.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== id));
  };

  const unreadCount = alerts?.filter(alert => !alert?.read)?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-card-foreground">Alerts</h3>
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs rounded-full px-2 py-1 font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <Icon name="Bell" size={20} className="text-primary" />
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No alerts</p>
          </div>
        ) : (
          alerts?.map((alert) => {
            const iconConfig = getAlertIcon(alert?.type);
            
            return (
              <div 
                key={alert?.id} 
                className={`p-4 rounded-lg border transition-smooth ${getAlertBackground(alert?.type)} ${
                  !alert?.read ? 'ring-1 ring-primary/20' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon 
                      name={iconConfig?.name} 
                      size={18} 
                      className={`mt-0.5 ${iconConfig?.color}`} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-card-foreground">
                          {alert?.title}
                        </h4>
                        {!alert?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert?.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(alert?.timestamp)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {!alert?.read && (
                            <button
                              onClick={() => markAsRead(alert?.id)}
                              className="text-xs text-primary hover:text-primary/80 transition-smooth"
                            >
                              Mark read
                            </button>
                          )}
                          {alert?.actionable && (
                            <button className="text-xs text-primary hover:text-primary/80 transition-smooth">
                              Take action
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert?.id)}
                    className="text-muted-foreground hover:text-foreground transition-smooth ml-2"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {alerts?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 transition-smooth">
            View All Alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertNotifications;