import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PortfolioOverview from './components/PortfolioOverview';
import InvestmentTabs from './components/InvestmentTabs';
import InvestmentCard from './components/InvestmentCard';
import PerformanceChart from './components/PerformanceChart';
import QuickActions from './components/QuickActions';
import AIInsights from './components/AIInsights';
import Icon from '../../components/AppIcon';

const InvestmentPortfolio = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [timeRange, setTimeRange] = useState('1M');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock portfolio data
  const portfolioData = {
    totalValue: 125750.50,
    dailyChange: 2450.75,
    dailyChangePercent: 1.98,
    assetAllocation: [
      { name: 'Stocks', percentage: 45, value: 56587.73, color: '#3B82F6' },
      { name: 'Mutual Funds', percentage: 35, value: 44012.68, color: '#8B5CF6' },
      { name: 'Fixed Deposits', percentage: 20, value: 25150.09, color: '#10B981' }
    ]
  };

  // Mock investments data
  const allInvestments = [
    {
      id: 1,
      name: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'stock',
      logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&h=100&fit=crop&crop=center',
      currentValue: 15750.00,
      investedAmount: 12000.00,
      gainLoss: 3750.00,
      changePercent: 31.25,
      quantity: 100,
      currentPrice: 157.50
    },
    {
      id: 2,
      name: 'Vanguard S&P 500 ETF',
      symbol: 'VOO',
      type: 'mutual-fund',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&h=100&fit=crop&crop=center',
      currentValue: 22500.00,
      investedAmount: 20000.00,
      gainLoss: 2500.00,
      changePercent: 12.50,
      quantity: 50,
      currentPrice: 450.00,
      nav: 450.00,
      expenseRatio: 0.03
    },
    {
      id: 3,
      name: 'Microsoft Corporation',
      symbol: 'MSFT',
      type: 'stock',
      logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop&crop=center',
      currentValue: 18900.00,
      investedAmount: 15000.00,
      gainLoss: 3900.00,
      changePercent: 26.00,
      quantity: 50,
      currentPrice: 378.00
    },
    {
      id: 4,
      name: 'HDFC Bank FD',
      symbol: 'FD001',
      type: 'fixed-deposit',
      currentValue: 25150.09,
      investedAmount: 25000.00,
      gainLoss: 150.09,
      changePercent: 0.60,
      quantity: 1,
      currentPrice: 25150.09,
      maturityDate: '2025-12-15',
      interestRate: 6.5
    },
    {
      id: 5,
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      type: 'stock',
      logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&h=100&fit=crop&crop=center',
      currentValue: 12450.00,
      investedAmount: 15000.00,
      gainLoss: -2550.00,
      changePercent: -17.00,
      quantity: 50,
      currentPrice: 249.00
    },
    {
      id: 6,
      name: 'Fidelity Blue Chip Growth',
      symbol: 'FBGRX',
      type: 'mutual-fund',
      currentValue: 18750.00,
      investedAmount: 16000.00,
      gainLoss: 2750.00,
      changePercent: 17.19,
      quantity: 125,
      currentPrice: 150.00,
      nav: 150.00,
      expenseRatio: 0.49
    }
  ];

  // Mock performance chart data
  const performanceData = [
    { date: 'Jan 1', value: 115000 },
    { date: 'Jan 8', value: 117500 },
    { date: 'Jan 15', value: 119200 },
    { date: 'Jan 22', value: 121800 },
    { date: 'Jan 29', value: 118900 },
    { date: 'Feb 5', value: 122400 },
    { date: 'Feb 12', value: 124100 },
    { date: 'Feb 19', value: 123600 },
    { date: 'Feb 26', value: 125750 }
  ];

  // Mock AI insights
  const aiInsights = [
    {
      type: 'recommendation',
      priority: 'high',
      title: 'Portfolio Rebalancing Recommended',
      description: `Your stock allocation is 5% above your target. Consider moving some funds to bonds or fixed deposits to maintain your desired risk profile.`,
      action: 'View Rebalancing Options'
    },
    {
      type: 'opportunity',
      priority: 'medium',
      title: 'Market Opportunity Detected',
      description: `Technology sector is showing strong momentum. Your current tech exposure is below optimal levels based on market trends.`,
      action: 'Explore Tech Investments'
    },
    {
      type: 'alert',
      priority: 'low',
      title: 'FD Maturity Approaching',
      description: `Your HDFC Bank FD worth $25,150 will mature in 10 months. Consider renewal options or alternative investments.`,
      action: 'Plan Reinvestment'
    }
  ];

  // Filter investments based on active tab and search
  const getFilteredInvestments = () => {
    let filtered = allInvestments;

    if (activeTab !== 'all') {
      const typeMap = {
        'stocks': 'stock',
        'mutual-funds': 'mutual-fund',
        'fixed-deposits': 'fixed-deposit'
      };
      filtered = filtered?.filter(inv => inv?.type === typeMap?.[activeTab]);
    }

    if (searchQuery) {
      filtered = filtered?.filter(inv => 
        inv?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        inv?.symbol?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredInvestments = getFilteredInvestments();

  // Tab counts
  const tabsData = {
    all: allInvestments?.length,
    stocks: allInvestments?.filter(inv => inv?.type === 'stock')?.length,
    mutualFunds: allInvestments?.filter(inv => inv?.type === 'mutual-fund')?.length,
    fixedDeposits: allInvestments?.filter(inv => inv?.type === 'fixed-deposit')?.length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Investment Portfolio</h1>
            <p className="text-muted-foreground mt-1">
              Track and analyze your investments with AI-powered insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search investments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <PortfolioOverview portfolioData={portfolioData} />

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart 
            data={performanceData} 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange} 
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Investment Tabs */}
            <InvestmentTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              tabsData={tabsData} 
            />

            {/* Investments Grid */}
            {filteredInvestments?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInvestments?.map((investment) => (
                  <InvestmentCard key={investment?.id} investment={investment} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Icon name="PieChart" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  No investments found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No investments match "${searchQuery}"`
                    : 'Start building your portfolio by adding your first investment'
                  }
                </p>
                {!searchQuery && (
                  <button className="flex items-center space-x-2 mx-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth">
                    <Icon name="Plus" size={16} />
                    <span>Add Investment</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <AIInsights insights={aiInsights} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPortfolio;