import React from 'react';
import Header from '../../components/ui/Header';
import FinancialHealthScore from './components/FinancialHealthScore';
import AccountBalanceCard from './components/AccountBalanceCard';
import MonthlySpendingSummary from './components/MonthlySpendingSummary';
import InvestmentPortfolioCard from './components/InvestmentPortfolioCard';
import QuickActionButtons from './components/QuickActionButtons';
import RecentTransactions from './components/RecentTransactions';
import BudgetProgressCard from './components/BudgetProgressCard';
import AlertNotifications from './components/AlertNotifications';
import SpendingTrendsChart from './components/SpendingTrendsChart';
import AIInsights from './components/AIInsights';
import AIFinancialChat from '../../components/ai/AIFinancialChat';

const Dashboard = () => {
  // Mock financial context for AI chat
  const financialContext = {
    monthlyIncome: 5000,
    currentBalance: 12500,
    monthlyExpenses: 3200,
    savingsGoal: 1000,
    recentCategories: ['Food & Dining', 'Transportation', 'Entertainment']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview for today.</p>
        </div>

        {/* Alert Notifications */}
        <AlertNotifications className="mb-6" />

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AccountBalanceCard />
          <MonthlySpendingSummary />
          <BudgetProgressCard />
          <FinancialHealthScore />
        </div>

        {/* Quick Actions */}
        <QuickActionButtons className="mb-8" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <SpendingTrendsChart />
            <RecentTransactions />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AIInsights />
            <InvestmentPortfolioCard />
          </div>
        </div>
      </div>

      {/* AI Financial Chat */}
      <AIFinancialChat financialContext={financialContext} />
    </div>
  );
};

export default Dashboard;