import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InvestmentTabs = ({ activeTab, onTabChange, tabsData }) => {
  const tabs = [
    { id: 'all', label: 'All Investments', icon: 'PieChart', count: tabsData?.all },
    { id: 'stocks', label: 'Stocks', icon: 'TrendingUp', count: tabsData?.stocks },
    { id: 'mutual-funds', label: 'Mutual Funds', icon: 'BarChart3', count: tabsData?.mutualFunds },
    { id: 'fixed-deposits', label: 'Fixed Deposits', icon: 'Landmark', count: tabsData?.fixedDeposits }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-1 mb-6">
      <div className="flex flex-wrap gap-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-smooth ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="hidden sm:inline">{tab?.label}</span>
            <span className="sm:hidden">{tab?.label?.split(' ')?.[0]}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab?.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvestmentTabs;