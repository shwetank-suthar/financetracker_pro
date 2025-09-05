import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Budget Alert',
      message: 'You\'ve spent 85% of your monthly dining budget',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Investment Gain',
      message: 'Your portfolio gained $245 today',
      time: '4 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Bill Reminder',
      message: 'Credit card payment due in 3 days',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Goal Achievement',
      message: 'Emergency fund goal reached!',
      time: '2 days ago',
      read: true
    }
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-warning' };
      case 'success':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'error':
        return { name: 'XCircle', color: 'text-error' };
      default:
        return { name: 'Info', color: 'text-primary' };
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev?.map(notification =>
        notification?.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev?.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Notifications"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-popover-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 transition-smooth"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications?.map((notification) => {
                const iconConfig = getNotificationIcon(notification?.type);
                return (
                  <div
                    key={notification?.id}
                    className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-smooth ${
                      !notification?.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon
                        name={iconConfig?.name}
                        size={16}
                        className={`mt-0.5 ${iconConfig?.color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-popover-foreground">
                            {notification?.title}
                          </p>
                          <button
                            onClick={() => clearNotification(notification?.id)}
                            className="text-muted-foreground hover:text-foreground transition-smooth"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification?.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {notification?.time}
                          </p>
                          {!notification?.read && (
                            <button
                              onClick={() => markAsRead(notification?.id)}
                              className="text-xs text-primary hover:text-primary/80 transition-smooth"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications?.length > 0 && (
            <div className="p-3 border-t border-border">
              <button className="w-full text-sm text-primary hover:text-primary/80 transition-smooth">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;