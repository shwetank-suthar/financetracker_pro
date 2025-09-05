// ... keep existing code ...

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';
import { generateFinancialInsights } from '../../../services/openaiService';
import Icon from '../../../components/AppIcon';


const AIInsights = ({ className = "" }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock financial data - replace with actual data from your app state/context
  const mockFinancialData = {
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    savingsGoal: 1000,
    currentSavings: 15000,
    investments: 25000,
    recentTransactions: [
      { category: 'Food', amount: 125.50, date: '2025-01-04' },
      { category: 'Transportation', amount: 45.00, date: '2025-01-03' },
      { category: 'Entertainment', amount: 85.25, date: '2025-01-02' },
    ],
    categories: {
      housing: 1200,
      food: 400,
      transportation: 300,
      entertainment: 200,
      utilities: 150,
      others: 1250
    }
  };

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const insightsData = await generateFinancialInsights(mockFinancialData, 'general');
        setInsights(insightsData);
      } catch (err) {
        setError('Failed to load AI insights');
        console.error('AI insights error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const quickInsights = [
    {
      icon: TrendingUp,
      title: "Spending Trend",
      description: "Your expenses are 15% lower this month",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: AlertTriangle,
      title: "Budget Alert",
      description: "Food category is 80% of budget limit",
      color: "text-yellow-600 bg-yellow-50"
    },
    {
      icon: Lightbulb,
      title: "Savings Tip",
      description: "Consider automating your savings",
      color: "text-blue-600 bg-blue-50"
    }
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3]?.map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
          <span>View All</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {/* AI Generated Insight */}
      {insights && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {insights?.insights?.length > 200 
                  ? `${insights?.insights?.substring(0, 200)}...` 
                  : insights?.insights}
              </p>
              <div className="text-xs text-gray-500 mt-2">
                Generated {new Date(insights.timestamp)?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Quick Insights */}
      <div className="space-y-3">
        {quickInsights?.map((insight, index) => {
          const Icon = insight?.icon;
          return (
            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
              <div className={`p-2 rounded-full ${insight?.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{insight?.title}</h4>
                <p className="text-sm text-gray-600">{insight?.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          );
        })}
      </div>
      {/* Action Button */}
      <div className="mt-4 pt-4 border-t">
        <button className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          Get Personalized Recommendations
        </button>
      </div>
    </div>
  );
};

export default AIInsights;

// ... rest of code ...