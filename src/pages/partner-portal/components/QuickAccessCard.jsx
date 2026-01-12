import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickAccessCard = ({ title, items }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const getItemColor = (index) => {
    const colors = [
      'var(--color-primary)',
      'var(--color-accent)',
      'var(--color-success)',
      'var(--color-secondary)'
    ];
    return colors?.[index % colors?.length];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {items?.map((item, index) => (
          <button
            key={item?.id}
            onClick={() => handleNavigation(item?.path)}
            className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevation-sm transition-smooth text-left"
          >
            <div 
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${getItemColor(index)}15` }}
            >
              <Icon 
                name={item?.icon} 
                size={24} 
                color={getItemColor(index)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-0.5">
                {item?.label}
              </p>
              <p className="caption text-muted-foreground line-clamp-1">
                {item?.description}
              </p>
            </div>
            <Icon name="ChevronRight" size={20} className="text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCard;