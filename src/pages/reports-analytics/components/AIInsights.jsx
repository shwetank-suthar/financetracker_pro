import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, BarChart3, Target, RefreshCw } from 'lucide-react';
import { generateFinancialInsights, getStructuredFinancialRecommendations, generateBudgetPlan } from '../../../services/openaiService';

const AIInsights = ({ insights: propInsights, reportData, className = "" }) => {
  const [insights, setInsights] = useState(propInsights);
  const [recommendations, setRecommendations] = useState(null);
  const [budgetPlan, setBudgetPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');

  // Mock report data if none provided
  const mockReportData = reportData || {
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    savings: 1500,
    categories: {
      housing: 1200,
      food: 400,
      transportation: 300,
      entertainment: 200,
      utilities: 150,
      healthcare: 100,
      others: 1150
    },
    trends: {
      spendingTrend: -5.2, // Negative means decrease
      savingsTrend: 12.5,
      incomeGrowth: 3.1
    },
    goals: [
      { name: 'Emergency Fund', target: 15000, current: 12000 },
      { name: 'Vacation', target: 3000, current: 1200 },
      { name: 'Investment', target: 10000, current: 7500 }
    ],
    period: 'last_6_months'
  };

  const analyzeReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userProfile = {
        income: mockReportData?.monthlyIncome,
        expenses: mockReportData?.monthlyExpenses,
        savings: mockReportData?.savings,
        goals: mockReportData?.goals,
        spendingCategories: mockReportData?.categories
      };

      const [insightsData, recommendationsData, budgetData] = await Promise.all([
        generateFinancialInsights(mockReportData, 'general'),
        getStructuredFinancialRecommendations(userProfile, mockReportData?.goals),
        generateBudgetPlan(
          { monthly: mockReportData?.monthlyIncome },
          mockReportData?.categories,
          mockReportData?.goals
        )
      ]);
      
      setInsights(insightsData);
      setRecommendations(recommendationsData);
      setBudgetPlan(budgetData);
    } catch (err) {
      setError('Failed to generate AI analysis. Please try again.');
      console.error('Report analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInsights(propInsights);
  }, [propInsights]);

  useEffect(() => {
    if (!propInsights) {
      analyzeReports();
    }
  }, [reportData]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    })?.format(amount);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Analysis</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Financial Analysis</h3>
          </div>
          <button
            onClick={analyzeReports}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Financial Analysis</h3>
          </div>
          <button
            onClick={analyzeReports}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2 px-2 rounded text-xs sm:text-sm font-medium transition-colors text-center truncate ${
              activeTab === 'insights' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-2 px-2 rounded text-xs sm:text-sm font-medium transition-colors text-center truncate ${
              activeTab === 'recommendations' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="hidden sm:inline">Recommendations</span>
            <span className="sm:hidden">Recs</span>
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`flex-1 py-2 px-2 rounded text-xs sm:text-sm font-medium transition-colors text-center truncate ${
              activeTab === 'budget' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="hidden sm:inline">AI Budget</span>
            <span className="sm:hidden">Budget</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'insights' && (
          insights ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span>Comprehensive Analysis</span>
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {insights?.insights}
              </p>
              <div className="text-xs text-gray-500 mt-3 border-t border-blue-200 pt-2">
                Generated on {insights?.timestamp ? new Date(insights.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-green-600">
                  {mockReportData?.trends?.spendingTrend > 0 ? '+' : ''}{mockReportData?.trends?.spendingTrend}%
                </div>
                <div className="text-xs text-green-700">Spending Change</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-blue-600">
                  +{mockReportData?.trends?.savingsTrend}%
                </div>
                <div className="text-xs text-blue-700">Savings Growth</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-purple-600">
                  +{mockReportData?.trends?.incomeGrowth}%
                </div>
                <div className="text-xs text-purple-700">Income Growth</div>
              </div>
            </div>
          </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No insights available yet. Add some expenses and investments to get AI-powered analysis.</p>
            </div>
          )
        )}

        {activeTab === 'recommendations' && recommendations && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Summary:</strong> {recommendations?.summary}
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-gray-600">
                  Confidence: {Math.round(recommendations?.confidence_score * 100)}%
                </span>
                <span className="text-gray-600">
                  Risk: {recommendations?.risk_assessment}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {recommendations?.recommendations?.map((rec, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">{rec?.title}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec?.priority)}`}>
                      {rec?.priority}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec?.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{rec?.category}</span>
                    {rec?.timeframe && <span>{rec?.timeframe}</span>}
                  </div>
                  {rec?.potential_impact && (
                    <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {rec?.potential_impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'budget' && budgetPlan && (
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">AI-Generated Budget Plan</h4>
              <p className="text-sm text-gray-600">Personalized budget based on your financial patterns and goals.</p>
            </div>

            {/* Budget Overview */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(budgetPlan?.monthly_budget?.total_income || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Monthly Income</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(budgetPlan?.monthly_budget?.needs || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Needs (50%)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {formatCurrency(budgetPlan?.monthly_budget?.wants || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Wants (30%)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {formatCurrency(budgetPlan?.monthly_budget?.savings || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Savings (20%)</div>
                </div>
              </div>
            </div>

            {/* Category Allocations */}
            {budgetPlan?.category_allocations && (
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Category Budget Breakdown</h5>
                <div className="space-y-2">
                  {Object.entries(budgetPlan?.category_allocations)?.map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm capitalize text-gray-700">{category}:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {budgetPlan?.recommendations && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Budget Recommendations</span>
                </h5>
                <ul className="space-y-2">
                  {budgetPlan?.recommendations?.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Savings Rate */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Target Savings Rate:</span>
              <span className="text-lg font-bold text-blue-600">{budgetPlan?.savings_rate}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;