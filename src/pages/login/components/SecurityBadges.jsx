import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      id: 'ssl',
      icon: 'Lock',
      label: 'SSL Encrypted',
      color: 'success'
    },
    {
      id: 'gdpr',
      icon: 'Shield',
      label: 'GDPR Compliant',
      color: 'primary'
    },
    {
      id: 'iso',
      icon: 'Award',
      label: 'ISO 27001',
      color: 'secondary'
    },
    {
      id: 'soc2',
      icon: 'CheckCircle2',
      label: 'SOC 2 Type II',
      color: 'accent'
    }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {securityFeatures?.map((feature) => (
          <div
            key={feature?.id}
            className="flex items-center space-x-2 px-3 py-2 bg-muted/30 rounded-lg"
            title={feature?.label}
          >
            <Icon
              name={feature?.icon}
              size={16}
              color={`var(--color-${feature?.color})`}
            />
            <span className="caption text-muted-foreground font-medium">
              {feature?.label}
            </span>
          </div>
        ))}
      </div>
      <p className="caption text-muted-foreground text-center mt-4">
        Your data is protected with enterprise-grade security
      </p>
    </div>
  );
};

export default SecurityBadges;