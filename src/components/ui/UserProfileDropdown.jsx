import React, { useState, useRef, useEffect } from 'react';

import Icon from '../AppIcon';
import Image from '../AppImage';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    avatar: '/assets/images/avatar-placeholder.jpg'
  };

  const menuItems = [
    {
      label: 'Profile Settings',
      icon: 'User',
      action: () => console.log('Navigate to profile')
    },
    {
      label: 'Account Settings',
      icon: 'Settings',
      action: () => console.log('Navigate to settings')
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => console.log('Navigate to help')
    },
    {
      type: 'divider'
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      action: () => console.log('Sign out user'),
      variant: 'destructive'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (event?.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image
          src={user?.avatar}
          alt={user?.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <Image
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-popover-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            {menuItems?.map((item, index) => {
              if (item?.type === 'divider') {
                return <div key={index} className="my-1 border-t border-border" />;
              }
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    item?.action();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-smooth ${
                    item?.variant === 'destructive' ?'text-destructive hover:bg-destructive/10' :'text-popover-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;