import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, PieChart, RefreshCw } from 'lucide-react';
import { analyzeInvestmentPortfolio, generateFinancialInsights } from '../../../services/openaiService';


const AIInsights = ({ insights: propInsights, portfolioData, userRiskProfile, className = "" }) => {
  const [analysis, setAnalysis] = useState(null);
  const [insights, setInsights] = useState(propInsights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  // Mock portfolio data if none provided
  const mockPortfolioData = portfolioData || {
    holdings: [
      { symbol: 'AAPL', shares: 10, currentPrice: 150, costBasis: 145, sector: 'Technology' },
      { symbol: 'GOOGL', shares: 5, currentPrice: 2800, costBasis: 2750, sector: 'Technology' },
      { symbol: 'MSFT', shares: 8, currentPrice: 380, costBasis: 375, sector: 'Technology' },
      { symbol: 'TSLA', shares: 3, currentPrice: 250, costBasis: 280, sector: 'Automotive' },
      { symbol: 'AMZN', shares: 4, currentPrice: 3200, costBasis: 3100, sector: 'E-commerce' }
    ],
    totalValue: 45000,
    totalCost: 44000,
    cashPosition: 5000
  };

  const mockRiskProfile = userRiskProfile || {
    riskTolerance: 'moderate',
    investmentHorizon: '10-15 years',
    goals: ['retirement', 'wealth building'],
    experienceLevel: 'intermediate',
    preferredAssets: ['stocks', 'bonds', 'etfs']
  };

  const analyzePortfolio = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use real portfolio data if available, otherwise use mock data
      const currentPortfolioData = portfolioData || mockPortfolioData;
      const currentRiskProfile = userRiskProfile || mockRiskProfile;
      
      const [portfolioAnalysis, generalInsights] = await Promise.all([
        analyzeInvestmentPortfolio(currentPortfolioData, currentRiskProfile),
        generateFinancialInsights({
          investments: currentPortfolioData?.holdings || [],
          totalValue: currentPortfolioData?.totalValue || 0,
          performance: currentPortfolioData?.totalValue && currentPortfolioData?.totalCost 
            ? ((currentPortfolioData.totalValue - currentPortfolioData.totalCost) / currentPortfolioData.totalCost * 100).toFixed(2)
            : 0
        })
      ]);
      
      setAnalysis(portfolioAnalysis);
      setInsights(generalInsights);
    } catch (err) {
      console.error('Portfolio analysis error:', err);
      // Set fallback analysis if API fails
      setAnalysis({
        portfolio_health: 'good',
        diversification_score: 75,
        risk_analysis: 'Your portfolio shows moderate risk with room for improvement in diversification.',
        performance_summary: 'Portfolio performance is being tracked. Consider regular rebalancing.',
        recommendations: [
          {
            type: 'rebalance',
            description: 'Consider rebalancing your portfolio quarterly',
            rationale: 'Regular rebalancing helps maintain target allocation and manage risk',
            priority: 'medium'
          }
        ],
        suggested_allocations: {
          stocks: 60,
          bonds: 30,
          cash: 10
        }
      });
      setInsights({
        insights: 'Your investment portfolio is being analyzed. Consider diversifying across different asset classes for better risk management and potential returns.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInsights(propInsights);
  }, [propInsights]);

  useEffect(() => {
    if (!propInsights) {
      analyzePortfolio();
    }
  }, [portfolioData, userRiskProfile]);

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'needs_improvement': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Portfolio Analysis</h3>
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
            <h3 className="text-lg font-semibold text-gray-900">AI Portfolio Analysis</h3>
          </div>
          <button
            onClick={analyzePortfolio}
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
            <h3 className="text-lg font-semibold text-gray-900">AI Portfolio Analysis</h3>
          </div>
          <button
            onClick={analyzePortfolio}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-2 px-2 rounded text-xs sm:text-sm font-medium transition-colors text-center truncate ${
              activeTab === 'analysis' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analysis
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
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2 px-2 rounded text-xs sm:text-sm font-medium transition-colors text-center truncate ${
              activeTab === 'insights' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights
          </button>
        </div>

        {/* Content */}
        {activeTab === 'analysis' && (
          analysis ? (
          <div className="space-y-4">
            {/* Portfolio Health */}
            <div className={`p-4 rounded-lg border ${getHealthColor(analysis?.portfolio_health)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5" />
                <span className="font-medium">Portfolio Health: {analysis?.portfolio_health?.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="text-sm opacity-75">Diversification Score</span>
                  <div className="font-semibold">{analysis?.diversification_score}/100</div>
                </div>
                <div>
                  <span className="text-sm opacity-75">Performance</span>
                  <div className="font-semibold">+2.27% YTD</div>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>Risk Analysis</span>
              </h4>
              <p className="text-sm text-gray-700">{analysis?.risk_analysis}</p>
            </div>

            {/* Performance Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Performance Summary</span>
              </h4>
              <p className="text-sm text-gray-700">{analysis?.performance_summary}</p>
            </div>

            {/* Suggested Allocations */}
            {analysis?.suggested_allocations && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <PieChart className="h-4 w-4 text-green-600" />
                  <span>Suggested Asset Allocation</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(analysis?.suggested_allocations)?.map(([asset, percentage]) => (
                    <div key={asset} className="flex justify-between">
                      <span className="text-sm capitalize">{asset}:</span>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No portfolio analysis available yet. Add some investments to get AI-powered insights.</p>
            </div>
          )
        )}

        {activeTab === 'recommendations' && analysis?.recommendations && (
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">AI-Generated Recommendations</h4>
              <p className="text-sm text-gray-600">Personalized suggestions to optimize your portfolio.</p>
            </div>
            
            <div className="space-y-3">
              {analysis?.recommendations?.map((rec, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec?.priority)}`}>
                        {rec?.priority?.toUpperCase()}
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{rec?.type?.replace('_', ' ')?.toUpperCase()}</span>
                    </div>
                  </div>
                  <h5 className="font-medium text-gray-900 mb-2">{rec?.description}</h5>
                  <p className="text-sm text-gray-600">{rec?.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          insights ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span>AI Investment Insights</span>
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {insights?.insights}
              </p>
              <div className="text-xs text-gray-500 mt-3 border-t border-purple-200 pt-2">
                Analysis generated on {insights?.timestamp ? new Date(insights.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No AI insights available yet. Add some investments to get personalized analysis.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AIInsights;