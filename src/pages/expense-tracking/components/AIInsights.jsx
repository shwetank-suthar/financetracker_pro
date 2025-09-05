import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, PieChart, Target } from 'lucide-react';
import { generateFinancialInsights, categorizeExpenses } from '../../../services/openaiService';
import Icon from '../../../components/AppIcon';


const AIInsights = ({ expenses = [], className = "" }) => {
  const [insights, setInsights] = useState(null);
  const [categorizations, setCategorizations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');

  // Mock expense data if none provided
  const mockExpenses = expenses?.length > 0 ? expenses : [
    { id: '1', description: 'Starbucks Coffee', amount: 4.95, date: '2025-01-04', category: 'Food & Dining' },
    { id: '2', description: 'Uber Ride', amount: 12.50, date: '2025-01-04', category: 'Transportation' },
    { id: '3', description: 'Netflix Subscription', amount: 15.99, date: '2025-01-03', category: 'Entertainment' },
    { id: '4', description: 'Grocery Store', amount: 67.23, date: '2025-01-03', category: 'Food & Dining' },
    { id: '5', description: 'Gas Station', amount: 35.00, date: '2025-01-02', category: 'Transportation' },
  ];

  const analyzeExpenses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare financial data for analysis
      const financialData = {
        expenses: mockExpenses,
        totalSpent: mockExpenses?.reduce((sum, expense) => sum + expense?.amount, 0),
        expenseCategories: mockExpenses?.reduce((acc, expense) => {
          acc[expense.category] = (acc?.[expense?.category] || 0) + expense?.amount;
          return acc;
        }, {}),
        period: 'current_month'
      };

      const [insightsData, categorizationData] = await Promise.all([
        generateFinancialInsights(financialData, 'spending'),
        categorizeExpenses(mockExpenses?.map(expense => ({
          transaction_id: expense?.id,
          description: expense?.description,
          amount: expense?.amount,
          current_category: expense?.category
        })))
      ]);
      
      setInsights(insightsData);
      setCategorizations(categorizationData);
    } catch (err) {
      setError('Failed to analyze expenses. Please try again.');
      console.error('Expense analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeExpenses();
  }, [expenses]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const spendingTips = [
    {
      icon: TrendingUp,
      title: "Track Daily Spending",
      description: "Monitor expenses in real-time to avoid overspending"
    },
    {
      icon: Target,
      title: "Set Category Limits",
      description: "Create spending limits for each category"
    },
    {
      icon: PieChart,
      title: "Review Monthly Patterns",
      description: "Analyze spending trends to identify optimization opportunities"
    }
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Expense Analysis</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Expense Analysis</h3>
        </div>
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
        <button
          onClick={analyzeExpenses}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Expense Analysis</h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'insights' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('categorization')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'categorization' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Smart Categories
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'tips' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tips
          </button>
        </div>

        {/* Content */}
        {activeTab === 'insights' && insights && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Spending Analysis</span>
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {insights?.insights}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'categorization' && categorizations && (
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Smart Categorization Suggestions</h4>
              <p className="text-sm text-gray-600">AI-powered suggestions to improve your expense categorization.</p>
            </div>
            
            <div className="space-y-3">
              {categorizations?.categorized_transactions?.map((transaction, index) => {
                const originalExpense = mockExpenses?.find(e => e?.id === transaction?.transaction_id);
                if (!originalExpense) return null;
                
                return (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{originalExpense?.description}</div>
                        <div className="text-sm text-gray-600">${originalExpense?.amount}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(transaction?.confidence)}`}>
                        {Math.round(transaction?.confidence * 100)}% confident
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-gray-600">
                        Current: <span className="font-medium">{originalExpense?.category}</span>
                      </div>
                      <div className="text-blue-600">
                        Suggested: <span className="font-medium">{transaction?.suggested_category}</span>
                      </div>
                    </div>
                    {transaction?.reasoning && (
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        {transaction?.reasoning}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Smart Spending Tips</h4>
              <p className="text-sm text-gray-600">Personalized recommendations to optimize your expenses.</p>
            </div>
            
            <div className="space-y-3">
              {spendingTips?.map((tip, index) => {
                const Icon = tip?.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">{tip?.title}</h5>
                      <p className="text-sm text-gray-600">{tip?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-900 text-sm">Pro Tip</h5>
                  <p className="text-sm text-green-700">
                    Use the AI chat feature to get personalized advice about specific expenses or spending patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;