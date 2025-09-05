import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLogin = () => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50'
    },
    {
      name: 'Microsoft',
      icon: 'Square',
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Apple',
      icon: 'Apple',
      color: 'text-gray-800',
      bgColor: 'hover:bg-gray-50'
    }
  ];

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider?.name);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Login with ${provider?.name} initiated`);
    } catch (error) {
      console.error(`${provider?.name} login failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.name}
            variant="outline"
            onClick={() => handleSocialLogin(provider)}
            loading={loadingProvider === provider?.name}
            disabled={loadingProvider !== null}
            className={`${provider?.bgColor} transition-smooth`}
            fullWidth
          >
            <div className="flex items-center justify-center space-x-3">
              <Icon 
                name={provider?.icon} 
                size={20} 
                className={provider?.color}
              />
              <span>Continue with {provider?.name}</span>
            </div>
          </Button>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary hover:text-primary/80 transition-smooth">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:text-primary/80 transition-smooth">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SocialLogin;