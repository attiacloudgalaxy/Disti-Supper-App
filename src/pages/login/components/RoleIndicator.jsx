import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleIndicator = () => {
  const roles = [
    {
      id: 'internal',
      title: 'Internal Staff',
      description: 'Distributor employees with full system access',
      icon: 'Building2',
      color: 'primary'
    },
    {
      id: 'partner',
      title: 'External Partner',
      description: 'Channel partners and resellers',
      icon: 'Users',
      color: 'secondary'
    }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4 text-center">
        Access Levels
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles?.map((role) => (
          <div
            key={role?.id}
            className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-smooth"
          >
            <div className="flex items-start space-x-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `var(--color-${role?.color})15` }}
              >
                <Icon
                  name={role?.icon}
                  size={20}
                  color={`var(--color-${role?.color})`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {role?.title}
                </h4>
                <p className="caption text-muted-foreground">
                  {role?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleIndicator;