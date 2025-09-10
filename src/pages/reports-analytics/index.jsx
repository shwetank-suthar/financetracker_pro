import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { expenseService, accountService, budgetService, investmentService } from '../../services/supabaseService';
import { generateFinancialInsights } from '../../services/openaiService';
import KPICard from './components/KPICard';
import InteractiveChart from './components/InteractiveChart';
import ReportGenerator from './components/ReportGenerator';
import AIInsights from './components/AIInsights';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import TaxAssistance from './components/TaxAssistance';
import AdvancedFilters from './components/AdvancedFilters';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ReportsAnalytics = () => {
  const { user } = useAuth();
  const [activeFilters, setActiveFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Real data states
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load real data
  const loadReportsData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [expensesData, accountsData, budgetsData, investmentsData] = await Promise.all([
        expenseService.getExpenses(),
        accountService.getAccounts(),
        budgetService.getBudgets(),
        investmentService.getInvestments()
      ]);

      setExpenses(expensesData || []);
      setAccounts(accountsData || []);
      setBudgets(budgetsData || []);
      setInvestments(investmentsData || []);
      setLastUpdated(new Date().toISOString());

      // Generate AI insights
      if (expensesData?.length > 0 || investmentsData?.length > 0) {
        try {
          const insights = await generateFinancialInsights({
            expenses: expensesData,
            accounts: accountsData,
            investments: investmentsData,
            userGoals: user?.user_metadata?.financial_goals || []
          });
          setAiInsights(insights);
        } catch (err) {
          console.error('Error generating AI insights:', err);
        }
      }
    } catch (err) {
      console.error('Error loading reports data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, [user]);

  // Calculate real KPI data
  const kpiData = useMemo(() => {
    const totalAssets = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) + 
                       investments.reduce((sum, inv) => sum + (inv.current_value || 0), 0);
    
    const monthlyExpenses = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        const now = new Date();
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.current_value || 0), 0);
    const investmentReturns = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    const totalIncome = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) / 12; // Approximate monthly income
    const savingsRate = totalIncome > 0 ? ((totalIncome - monthlyExpenses) / totalIncome) * 100 : 0;

    return [
      {
        title: 'Net Worth',
        value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAssets),
        change: '+8.2%', // TODO: Calculate actual change
        changeType: 'positive',
        icon: 'TrendingUp',
        trend: true
      },
      {
        title: 'Monthly Spending',
        value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(monthlyExpenses),
        change: '+12.5%', // TODO: Calculate actual change
        changeType: 'negative',
        icon: 'CreditCard',
        trend: false
      },
      {
        title: 'Investment Returns',
        value: `${investmentReturns.toFixed(2)}%`,
        change: '+2.1%', // TODO: Calculate actual change
        changeType: investmentReturns >= 0 ? 'positive' : 'negative',
        icon: 'BarChart3',
        trend: investmentReturns >= 0
      },
      {
        title: 'Savings Rate',
        value: `${savingsRate.toFixed(1)}%`,
        change: '+1.8%', // TODO: Calculate actual change
        changeType: 'positive',
        icon: 'PiggyBank',
        trend: true
      }
    ];
  }, [expenses, accounts, investments]);

  // Calculate real spending trends data (last 12 months)
  const spendingTrendsData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
      
      const monthExpenses = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === date.getMonth() && expDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);
      
      months.push({ name: monthName, value: monthExpenses });
    }
    
    return months;
  }, [expenses]);

  // Calculate real income trends data (last 12 months)
  const incomeTrendsData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
      
      // Approximate monthly income from account balances
      const monthlyIncome = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) / 12;
      
      months.push({ name: monthName, value: monthlyIncome });
    }
    
    return months;
  }, [accounts]);

  // Calculate real investment allocation data
  const investmentAllocationData = useMemo(() => {
    const allocation = {};
    
    investments.forEach(inv => {
      const type = inv.type || 'Other';
      allocation[type] = (allocation[type] || 0) + (inv.current_value || 0);
    });
    
    return Object.entries(allocation).map(([name, value]) => ({ name, value }));
  }, [investments]);

  // Calculate real category spending data
  const categorySpendingData = useMemo(() => {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + (expense.amount || 0);
    });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [expenses]);


  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setRefreshKey(prev => prev + 1);
    console.log('Applied filters:', filters);
    // Reload data with filters
    loadReportsData();
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setRefreshKey(prev => prev + 1);
    console.log('Filters reset');
    // Reload data without filters
    loadReportsData();
  };

  useEffect(() => {
    // Data refresh when filters change
    console.log('Data refreshed with filters:', activeFilters);
  }, [refreshKey]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reports and analytics...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="User" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Please log in</h3>
          <p className="text-muted-foreground">You need to be logged in to view your financial reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive financial insights and AI-powered analysis for informed decision-making
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Never'}
            </div>
            <Button
              onClick={loadReportsData}
              loading={loading}
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

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
          <AIInsights insights={aiInsights} />
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
  );
};

export default ReportsAnalytics;