import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, iconColor, trend, loading }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="caption text-muted-foreground mb-1">{title}</p>
          {loading ? (
            <div className="skeleton h-8 w-32 rounded" />
          ) : (
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground data-text">
              {value}
            </h3>
          )}
        </div>
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon name={icon} size={24} color={iconColor} />
        </div>
      </div>
      
      {change && (
        <div className="flex items-center space-x-2">
          <Icon 
            name={getTrendIcon()} 
            size={16} 
            className={getChangeColor()}
          />
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
          <span className="caption text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;