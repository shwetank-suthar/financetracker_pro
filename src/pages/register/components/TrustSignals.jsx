import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption protects all your financial data'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'Your data is never shared with third parties'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Certified',
      description: 'Independently audited security controls'
    },
    {
      icon: 'Eye',
      title: 'Transparent',
      description: 'Clear privacy policy with no hidden data usage'
    }
  ];

  const certifications = [
    {
      name: 'SSL Certificate',
      icon: 'Shield',
      verified: true
    },
    {
      name: 'PCI DSS Compliant',
      icon: 'CreditCard',
      verified: true
    },
    {
      name: 'GDPR Compliant',
      icon: 'FileText',
      verified: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground text-center">
          Your Financial Data is Secure
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures?.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name={feature?.icon} size={16} className="text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-card-foreground">
                  {feature?.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground text-center">
          Security Certifications
        </h4>
        
        <div className="flex flex-wrap justify-center gap-4">
          {certifications?.map((cert, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-full"
            >
              <Icon name={cert?.icon} size={14} className="text-success" />
              <span className="text-xs font-medium text-foreground">
                {cert?.name}
              </span>
              {cert?.verified && (
                <Icon name="CheckCircle" size={12} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Trust Statement */}
      <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <Icon name="Users" size={24} className="text-primary mx-auto mb-2" />
        <p className="text-sm text-foreground font-medium mb-1">
          Trusted by 50,000+ Users
        </p>
        <p className="text-xs text-muted-foreground">
          Join thousands who trust us with their financial management
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;