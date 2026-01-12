import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsCard = ({ metrics }) => {
  const getMetricIcon = (type) => {
    const icons = {
      revenue: 'DollarSign',
      deals: 'Briefcase',
      commission: 'TrendingUp',
      growth: 'BarChart3'
    };
    return icons?.[type] || 'Activity';
  };

  const getMetricColor = (type) => {
    const colors = {
      revenue: 'var(--color-primary)',
      deals: 'var(--color-accent)',
      commission: 'var(--color-success)',
      growth: 'var(--color-secondary)'
    };
    return colors?.[type] || 'var(--color-primary)';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="caption text-muted-foreground mb-1">{metrics?.label}</p>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground data-text">
            {metrics?.value}
          </h3>
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${getMetricColor(metrics?.type)}15` }}
        >
          <Icon 
            name={getMetricIcon(metrics?.type)} 
            size={24} 
            color={getMetricColor(metrics?.type)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 ${metrics?.trend === 'up' ? 'text-success' : 'text-error'}`}>
          <Icon 
            name={metrics?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={16} 
          />
          <span className="text-sm font-medium">{metrics?.change}</span>
        </div>
        <span className="caption text-muted-foreground">vs last month</span>
      </div>
      {metrics?.progress && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="caption text-muted-foreground">Target Progress</span>
            <span className="caption font-medium text-foreground">{metrics?.progress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${metrics?.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricsCard;