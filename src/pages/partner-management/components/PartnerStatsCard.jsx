import React from 'react';
import Icon from '../../../components/AppIcon';

const PartnerStatsCard = ({ icon, label, value, change, changeType, color = 'primary' }) => {
  const getColorClasses = () => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      accent: 'bg-accent/10 text-accent'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-elevation-md transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="caption text-muted-foreground mb-2">{label}</p>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            {value}
          </h3>
          {change && (
            <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={16} 
              />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default PartnerStatsCard;