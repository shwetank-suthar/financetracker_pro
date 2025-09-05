import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { generateFinancialInsights, getStructuredFinancialRecommendations } from '../../services/openaiService';

const AIInsightsWidget = ({ financialData, userProfile, className = "" }) => {
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');

  const fetchAIAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [insightsData, recommendationsData] = await Promise.all([
        generateFinancialInsights(financialData, 'general'),
        getStructuredFinancialRecommendations(userProfile, userProfile?.goals || [])
      ]);
      
      setInsights(insightsData);
      setRecommendations(recommendationsData);
    } catch (err) {
      setError('Failed to generate AI insights. Please try again.');
      console.error('AI insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (financialData && userProfile) {
      fetchAIAnalysis();
    }
  }, [financialData, userProfile]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Target className="h-4 w-4" />;
      case 'low': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <div className="animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
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
            <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
          </div>
          <button
            onClick={fetchAIAnalysis}
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
            <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
          </div>
          <button
            onClick={fetchAIAnalysis}
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
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'insights' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'recommendations' ?'bg-white text-blue-600 shadow-sm' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recommendations
          </button>
        </div>

        {/* Content */}
        {activeTab === 'insights' && insights && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {insights?.insights}
              </p>
            </div>
            <div className="text-xs text-gray-500 border-t pt-2">
              Generated on {new Date(insights.timestamp)?.toLocaleDateString()}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && recommendations && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
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
                      {getPriorityIcon(rec?.priority)}
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
                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {rec?.potential_impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsWidget;