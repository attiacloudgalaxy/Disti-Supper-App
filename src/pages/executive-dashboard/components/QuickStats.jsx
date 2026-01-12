import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4]?.map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="skeleton h-6 w-24 rounded mb-2" />
            <div className="skeleton h-8 w-32 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat) => (
        <div 
          key={stat?.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-md transition-smooth cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="caption text-muted-foreground">{stat?.label}</span>
            <Icon name={stat?.icon} size={18} className="text-muted-foreground" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold text-foreground data-text">
              {stat?.value}
            </span>
            {stat?.change && (
              <span className={`caption ${stat?.changeType === 'positive' ? 'text-success' : 'text-error'}`}>
                {stat?.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;