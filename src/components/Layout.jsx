import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './ui/Header';

const Layout = ({ children, showHeader = true }) => {
  const { user } = useAuth();

  // Don't show header on login/register pages
  const shouldShowHeader = showHeader && user;

  return (
    <div className="min-h-screen bg-background">
      {shouldShowHeader && <Header />}
      <main className={shouldShowHeader ? '' : 'min-h-screen'}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
