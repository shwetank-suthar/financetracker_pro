import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
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
        {/* Define your route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/investment-portfolio" element={<InvestmentPortfolio />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports-analytics" element={<ReportsAnalytics />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expense-tracking" element={<ExpenseTracking />} />
        <Route path="/product-search" element={<ProductSearch />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
