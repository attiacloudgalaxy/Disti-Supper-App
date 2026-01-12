import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  iconColor,
  trend,
  description 
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-elevation-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="caption text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground data-text">
            {value}
          </h3>
        </div>
        <div 
          className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon name={icon} size={20} color={iconColor} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getChangeIcon()} 
            size={16} 
            className={getChangeColor()}
          />
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
        </div>
        {description && (
          <span className="caption text-muted-foreground">
            {description}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between caption text-muted-foreground">
            <span>Trend</span>
            <span className="font-medium">{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;