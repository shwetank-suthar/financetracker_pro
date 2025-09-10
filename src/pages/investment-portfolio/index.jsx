import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { investmentService } from '../../services/supabaseService';
import IndianInvestmentTracker from '../../components/investment/IndianInvestmentTracker';
import PortfolioOverview from './components/PortfolioOverview';
import InvestmentTabs from './components/InvestmentTabs';
import InvestmentCard from './components/InvestmentCard';
import PerformanceChart from './components/PerformanceChart';
import QuickActions from './components/QuickActions';
import AIInsights from './components/AIInsights';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InvestmentPortfolio = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('portfolio'); // 'portfolio' or 'real-time'
  const [activeTab, setActiveTab] = useState('all');
  const [timeRange, setTimeRange] = useState('1M');
  const [searchQuery, setSearchQuery] = useState('');
  const [allInvestments, setAllInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user investments
  useEffect(() => {
    loadInvestments();
  }, [user]);

  const loadInvestments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const investments = await investmentService.getInvestments();
      setAllInvestments(investments || []);
    } catch (err) {
      console.error('Error loading investments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate portfolio data from user investments
  const portfolioData = React.useMemo(() => {
    if (!allInvestments.length) {
      return {
        totalValue: 0,
        dailyChange: 0,
        dailyChangePercent: 0,
        assetAllocation: []
      };
    }

    const totalValue = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.current_value || 0), 0);
    const totalInvested = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount || 0), 0);
    const totalGainLoss = totalValue - totalInvested;
    const dailyChangePercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    // Calculate asset allocation
    const assetTypes = {};
    allInvestments.forEach(inv => {
      const type = inv.type || 'other';
      if (!assetTypes[type]) {
        assetTypes[type] = { value: 0, count: 0 };
      }
      assetTypes[type].value += parseFloat(inv.current_value || 0);
      assetTypes[type].count += 1;
    });

    const assetAllocation = Object.entries(assetTypes).map(([type, data], index) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      value: data.value,
      color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][index % 5]
    }));

    return {
      totalValue,
      dailyChange: totalGainLoss,
      dailyChangePercent,
      assetAllocation
    };
  }, [allInvestments]);

  // Mock performance chart data - TODO: Replace with real data
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

  // Generate real AI insights based on user data
  const aiInsights = React.useMemo(() => {
    if (allInvestments.length === 0) {
      return [
        {
          type: 'recommendation',
          priority: 'high',
          title: 'Start Building Your Portfolio',
          description: 'You don\'t have any investments yet. Consider starting with diversified mutual funds or index funds for long-term growth.',
          action: 'Add Investment'
        }
      ];
    }

    const totalInvested = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount || 0), 0);
    const totalCurrentValue = allInvestments.reduce((sum, inv) => sum + parseFloat(inv.current_value || 0), 0);
    const totalGainLoss = totalCurrentValue - totalInvested;
    const gainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    const insights = [
      {
        type: 'performance',
        priority: gainLossPercent >= 0 ? 'low' : 'medium',
        title: `Portfolio Performance: ${gainLossPercent >= 0 ? 'Positive' : 'Negative'}`,
        description: `Your portfolio is ${gainLossPercent >= 0 ? 'up' : 'down'} ${Math.abs(gainLossPercent).toFixed(2)}% (₹${Math.abs(totalGainLoss).toLocaleString('en-IN')}) from your total investment of ₹${totalInvested.toLocaleString('en-IN')}.`,
        action: 'View Performance Details'
      }
    ];

    // Add diversification insight
    const uniqueTypes = new Set(allInvestments.map(inv => inv.type)).size;
    if (uniqueTypes < 3) {
      insights.push({
        type: 'recommendation',
        priority: 'medium',
        title: 'Diversification Opportunity',
        description: `You have investments in ${uniqueTypes} type${uniqueTypes !== 1 ? 's' : ''}. Consider diversifying across different asset classes for better risk management.`,
        action: 'Explore Diversification'
      });
    }

    // Add portfolio value insight
    insights.push({
      type: 'alert',
      priority: 'low',
      title: 'Portfolio Overview',
      description: `Your total portfolio value is ₹${totalCurrentValue.toLocaleString('en-IN')} across ${allInvestments.length} investment${allInvestments.length !== 1 ? 's' : ''}.`,
      action: 'View Portfolio Details'
    });

    return insights;
  }, [allInvestments, portfolioData]);

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

  // Format currency for Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your investment portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="AlertCircle" size={20} className="text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Error Loading Portfolio</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={loadInvestments}
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
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
            {/* View Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={activeView === 'portfolio' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('portfolio')}
                iconName="PieChart"
                iconPosition="left"
              >
                Portfolio
              </Button>
              <Button
                variant={activeView === 'real-time' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('real-time')}
                iconName="TrendingUp"
                iconPosition="left"
              >
                Real-time
              </Button>
            </div>
            
            {activeView === 'portfolio' && (
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
            )}
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'real-time' ? (
          <IndianInvestmentTracker />
        ) : (
          <>
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
                      {allInvestments.length === 0 ? 'No investments yet' : 'No investments found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery 
                        ? `No investments match "${searchQuery}"`
                        : allInvestments.length === 0 
                          ? 'Start building your portfolio by adding your first investment'
                          : 'Try adjusting your search or filter criteria'
                      }
                    </p>
                    {!searchQuery && allInvestments.length === 0 && (
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Plus"
                        iconPosition="left"
                        className="mx-auto"
                      >
                        Add Investment
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1">
                <AIInsights 
                  insights={aiInsights}
                  portfolioData={{
                    holdings: allInvestments.map(inv => ({
                      symbol: inv.symbol || inv.name,
                      shares: inv.quantity || 1,
                      currentPrice: inv.current_value / (inv.quantity || 1),
                      costBasis: inv.invested_amount / (inv.quantity || 1),
                      sector: inv.type || 'Other'
                    })),
                    totalValue: portfolioData.totalValue,
                    totalCost: allInvestments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount || 0), 0),
                    cashPosition: 0
                  }}
                  userRiskProfile={{
                    riskTolerance: 'moderate',
                    investmentHorizon: '10-15 years',
                    goals: ['wealth building', 'retirement'],
                    experienceLevel: 'intermediate',
                    preferredAssets: ['stocks', 'mutual-funds', 'fixed-deposits']
                  }}
                />
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default InvestmentPortfolio;