import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const QuickActionToolbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const quickActions = [
    {
      id: 'add-deal',
      label: 'Add Deal',
      icon: 'Plus',
      path: '/deal-management',
      color: 'primary',
      permissions: ['admin', 'manager']
    },
    {
      id: 'register-partner',
      label: 'Register Partner',
      icon: 'UserPlus',
      path: '/partner-management',
      color: 'secondary',
      permissions: ['admin', 'manager']
    },
    {
      id: 'generate-quote',
      label: 'Generate Quote',
      icon: 'FileText',
      path: '/quote-generation',
      color: 'accent',
      permissions: ['admin', 'manager', 'sales']
    },
    {
      id: 'check-inventory',
      label: 'Check Inventory',
      icon: 'Package',
      path: '/inventory-management',
      color: 'success',
      permissions: ['admin', 'manager', 'inventory']
    }
  ];

  const getContextualActions = () => {
    const currentPath = location?.pathname;
    
    if (currentPath?.includes('deal')) {
      return quickActions?.filter(action => 
        ['add-deal', 'generate-quote', 'check-inventory']?.includes(action?.id)
      );
    }
    
    if (currentPath?.includes('partner')) {
      return quickActions?.filter(action => 
        ['register-partner', 'add-deal', 'generate-quote']?.includes(action?.id)
      );
    }
    
    if (currentPath?.includes('inventory')) {
      return quickActions?.filter(action => 
        ['check-inventory', 'add-deal']?.includes(action?.id)
      );
    }

    return quickActions;
  };

  const contextualActions = getContextualActions();

  const handleActionClick = (action) => {
    navigate(action?.path);
    setIsMobileMenuOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="hidden lg:flex items-center space-x-3 p-4 border-t border-border bg-muted/30">
        {contextualActions?.map((action) => (
          <Button
            key={action?.id}
            variant="outline"
            size="sm"
            iconName={action?.icon}
            iconPosition="left"
            onClick={() => handleActionClick(action)}
            className="flex-1"
          >
            {action?.label}
          </Button>
        ))}
      </div>
      <div className="lg:hidden fixed bottom-6 right-6 z-[200]">
        <button
          onClick={handleMobileToggle}
          className="w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-elevation-lg hover:shadow-elevation-xl transition-smooth flex items-center justify-center press-scale"
          aria-label="Quick actions menu"
          aria-expanded={isMobileMenuOpen}
        >
          <Icon 
            name={isMobileMenuOpen ? 'X' : 'Zap'} 
            size={24} 
          />
        </button>

        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-background/80 z-[190]"
              onClick={handleMobileToggle}
              aria-hidden="true"
            />
            
            <div className="absolute bottom-20 right-0 w-64 bg-card border border-border rounded-lg shadow-elevation-xl z-[200] overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Quick Actions
                </h3>
              </div>
              
              <div className="p-2">
                {contextualActions?.map((action) => (
                  <button
                    key={action?.id}
                    onClick={() => handleActionClick(action)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-smooth text-left"
                  >
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `var(--color-${action?.color})`,
                        opacity: 0.1
                      }}
                    >
                      <Icon 
                        name={action?.icon} 
                        size={20}
                        color={`var(--color-${action?.color})`}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {action?.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default QuickActionToolbar;