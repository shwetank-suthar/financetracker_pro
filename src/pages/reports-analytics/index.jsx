import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import InteractiveChart from './components/InteractiveChart';
import ReportGenerator from './components/ReportGenerator';
import AIInsights from './components/AIInsights';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import TaxAssistance from './components/TaxAssistance';
import AdvancedFilters from './components/AdvancedFilters';

const ReportsAnalytics = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data for KPI cards
  const kpiData = [
    {
      title: 'Net Worth',
      value: '$127,450',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      trend: true
    },
    {
      title: 'Monthly Spending',
      value: '$3,247',
      change: '+12.5%',
      changeType: 'negative',
      icon: 'CreditCard',
      trend: false
    },
    {
      title: 'Investment Returns',
      value: '+15.8%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'BarChart3',
      trend: true
    },
    {
      title: 'Savings Rate',
      value: '22.4%',
      change: '+1.8%',
      changeType: 'positive',
      icon: 'PiggyBank',
      trend: true
    }
  ];

  // Mock data for spending trends chart
  const spendingTrendsData = [
    { name: 'Jan', value: 2800 },
    { name: 'Feb', value: 3100 },
    { name: 'Mar', value: 2900 },
    { name: 'Apr', value: 3200 },
    { name: 'May', value: 3000 },
    { name: 'Jun', value: 3400 },
    { name: 'Jul', value: 3100 },
    { name: 'Aug', value: 3300 },
    { name: 'Sep', value: 2900 },
    { name: 'Oct', value: 3200 },
    { name: 'Nov', value: 3500 },
    { name: 'Dec', value: 3800 }
  ];

  // Mock data for income trends chart
  const incomeTrendsData = [
    { name: 'Jan', value: 7500 },
    { name: 'Feb', value: 7500 },
    { name: 'Mar', value: 7800 },
    { name: 'Apr', value: 7500 },
    { name: 'May', value: 8200 },
    { name: 'Jun', value: 7500 },
    { name: 'Jul', value: 7500 },
    { name: 'Aug', value: 7900 },
    { name: 'Sep', value: 7500 },
    { name: 'Oct', value: 7500 },
    { name: 'Nov', value: 8500 },
    { name: 'Dec', value: 9200 }
  ];

  // Mock data for investment allocation
  const investmentAllocationData = [
    { name: 'Stocks', value: 45000 },
    { name: 'Bonds', value: 18000 },
    { name: 'Real Estate', value: 25000 },
    { name: 'Cash', value: 12000 },
    { name: 'Crypto', value: 8000 }
  ];

  // Mock data for category spending
  const categorySpendingData = [
    { name: 'Food & Dining', value: 847 },
    { name: 'Transportation', value: 320 },
    { name: 'Shopping', value: 650 },
    { name: 'Entertainment', value: 280 },
    { name: 'Bills & Utilities', value: 450 },
    { name: 'Healthcare', value: 180 }
  ];

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setRefreshKey(prev => prev + 1);
    console.log('Applied filters:', filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setRefreshKey(prev => prev + 1);
    console.log('Filters reset');
  };

  useEffect(() => {
    // Simulate data refresh when filters change
    console.log('Data refreshed with filters:', activeFilters);
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive financial insights and AI-powered analysis for informed decision-making
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date()?.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters 
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Key Performance Indicators */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                trend={kpi?.trend}
              />
            ))}
          </div>
        </div>

        {/* Interactive Charts */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Financial Trends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              title="Spending Trends"
              data={spendingTrendsData}
              type="line"
              height={350}
            />
            <InteractiveChart
              title="Income Trends"
              data={incomeTrendsData}
              type="area"
              height={350}
            />
            <InteractiveChart
              title="Investment Allocation"
              data={investmentAllocationData}
              type="pie"
              height={350}
            />
            <InteractiveChart
              title="Category Spending"
              data={categorySpendingData}
              type="bar"
              height={350}
            />
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">AI-Powered Insights</h2>
          <AIInsights />
        </div>

        {/* Comparative Analysis */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Comparative Analysis</h2>
          <ComparativeAnalysis />
        </div>

        {/* Report Generator and Tax Assistance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Report Generation</h2>
            <ReportGenerator />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Tax Assistance</h2>
            <TaxAssistance />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date()?.getFullYear()} FinanceTracker Pro. All data is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;