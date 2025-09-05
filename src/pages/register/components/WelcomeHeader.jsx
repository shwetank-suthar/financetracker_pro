import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-6 mb-8">
      {/* Logo */}
      <Link to="/" className="inline-flex items-center space-x-3">
        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-subtle">
          <Icon name="DollarSign" size={28} color="white" />
        </div>
        <span className="text-2xl font-bold text-foreground">
          FinanceTracker Pro
        </span>
      </Link>

      {/* Welcome Message */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">
          Create Your Account
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Join thousands of users who trust FinanceTracker Pro to manage their finances, 
          track investments, and achieve their financial goals with AI-powered insights.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="TrendingUp" size={16} className="text-success" />
          <span>Investment Tracking</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Brain" size={16} className="text-primary" />
          <span>AI Insights</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Shield" size={16} className="text-warning" />
          <span>Secure & Private</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;