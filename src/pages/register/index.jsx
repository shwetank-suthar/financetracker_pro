import React from 'react';
import { Helmet } from 'react-helmet';
import WelcomeHeader from './components/WelcomeHeader';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - FinanceTracker Pro</title>
        <meta 
          name="description" 
          content="Join FinanceTracker Pro to manage your finances, track investments, and get AI-powered insights. Secure registration with bank-level encryption." 
        />
        <meta name="keywords" content="finance tracker, investment portfolio, budget management, financial planning, secure registration" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Welcome & Form */}
              <div className="space-y-8">
                <WelcomeHeader />
                <RegistrationForm />
              </div>

              {/* Right Column - Trust Signals */}
              <div className="lg:sticky lg:top-8">
                <TrustSignals />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="/terms" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Terms of Service
                </a>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Privacy Policy
                </a>
                <a href="/security" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Security
                </a>
                <a href="/support" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Support
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} FinanceTracker Pro. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Register;