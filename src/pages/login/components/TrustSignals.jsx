import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Bank-Level Security',
      description: 'Financial data secured with industry standards'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Certified',
      description: 'Independently audited security controls'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="text-center mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Your Financial Data is Secure
        </h2>
        <p className="text-sm text-muted-foreground">
          We use enterprise-grade security to protect your information
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trustBadges?.map((badge, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-subtle transition-smooth"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-4">
              <Icon name={badge?.icon} size={24} className="text-success" />
            </div>
            <h3 className="text-sm font-medium text-card-foreground mb-2">
              {badge?.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {badge?.description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-primary" />
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span>24/7 Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;