import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Layout from "components/Layout";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import InvestmentPortfolio from './pages/investment-portfolio';
import Dashboard from './pages/dashboard';
import ReportsAnalytics from './pages/reports-analytics';
import Register from './pages/register';
import ExpenseTracking from './pages/expense-tracking';
import ProductSearch from './pages/product-search';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Auth pages without header */}
        <Route path="/" element={<Layout showHeader={false}><LoginPage /></Layout>} />
        <Route path="/login" element={<Layout showHeader={false}><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout showHeader={false}><Register /></Layout>} />
        
        {/* Main app pages with header */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/investment-portfolio" element={<Layout><InvestmentPortfolio /></Layout>} />
        <Route path="/reports-analytics" element={<Layout><ReportsAnalytics /></Layout>} />
        <Route path="/expense-tracking" element={<Layout><ExpenseTracking /></Layout>} />
        <Route path="/product-search" element={<Layout><ProductSearch /></Layout>} />
        
        {/* 404 page */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
