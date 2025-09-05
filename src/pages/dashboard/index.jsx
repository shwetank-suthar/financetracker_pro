import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RealTimeDashboard from './components/RealTimeDashboard';
import AIFinancialChat from '../../components/ai/AIFinancialChat';

const Dashboard = () => {
  const { user } = useAuth();

  // Financial context for AI chat
  const financialContext = {
    user: user?.user_metadata,
    goals: user?.user_metadata?.financial_goals || [],
    currency: user?.user_metadata?.primary_currency || 'INR'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Dashboard */}
        <RealTimeDashboard />
      </div>

      {/* AI Financial Chat */}
      <AIFinancialChat financialContext={financialContext} />
    </div>
  );
};

export default Dashboard;