import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities, loading }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      deal: 'Briefcase',
      partner: 'Users',
      compliance: 'Shield',
      quote: 'FileText',
      inventory: 'Package'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      deal: 'var(--color-success)',
      partner: 'var(--color-primary)',
      compliance: 'var(--color-warning)',
      quote: 'var(--color-accent)',
      inventory: 'var(--color-error)'
    };
    return colorMap?.[type] || 'var(--color-primary)';
  };

  const getPriorityBadge = (priority) => {
    const badgeMap = {
      high: 'bg-error/10 text-error',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-success/10 text-success'
    };
    return badgeMap?.[priority] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="skeleton h-8 w-48 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4]?.map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="skeleton w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Recent Activity</h3>
        <button className="caption text-primary hover:text-primary/80 transition-smooth">
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities?.map((activity) => (
          <div 
            key={activity?.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
          >
            <div 
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${getActivityColor(activity?.type)}15` }}
            >
              <Icon 
                name={getActivityIcon(activity?.type)} 
                size={20}
                color={getActivityColor(activity?.type)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {activity?.title}
                </p>
                {activity?.priority && (
                  <span className={`caption px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${getPriorityBadge(activity?.priority)}`}>
                    {activity?.priority}
                  </span>
                )}
              </div>
              <p className="caption text-muted-foreground line-clamp-2 mb-2">
                {activity?.description}
              </p>
              <div className="flex items-center space-x-3">
                <span className="caption text-muted-foreground">
                  {activity?.timestamp}
                </span>
                {activity?.user && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="caption text-muted-foreground">
                      {activity?.user}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;