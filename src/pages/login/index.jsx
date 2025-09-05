import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import SocialLogin from './components/SocialLogin';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          <LoginForm />
          <SocialLogin />
        </div>
        
        {/* Trust Signals Section */}
        <TrustSignals />
      </div>
      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} FinanceTracker Pro. All rights reserved.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-smooth">
                Help Center
              </a>
              <a href="#" className="hover:text-foreground transition-smooth">
                Contact Support
              </a>
              <a href="#" className="hover:text-foreground transition-smooth">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;