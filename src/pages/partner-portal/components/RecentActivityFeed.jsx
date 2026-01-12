import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      deal: 'Briefcase',
      approval: 'CheckCircle2',
      quote: 'FileText',
      training: 'BookOpen',
      commission: 'DollarSign',
      announcement: 'Bell',
      document: 'File'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      deal: 'var(--color-primary)',
      approval: 'var(--color-success)',
      quote: 'var(--color-accent)',
      training: 'var(--color-secondary)',
      commission: 'var(--color-success)',
      announcement: 'var(--color-warning)',
      document: 'var(--color-primary)'
    };
    return colors?.[type] || 'var(--color-primary)';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Recent Activity</h3>
        <button className="caption text-primary hover:text-primary/80 transition-smooth font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 md:space-x-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
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
              <p className="text-sm font-medium text-foreground mb-1">
                {activity?.title}
              </p>
              <p className="caption text-muted-foreground line-clamp-2">
                {activity?.description}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="caption text-muted-foreground">
                  {formatTimestamp(activity?.timestamp)}
                </span>
                {activity?.actionable && (
                  <button className="caption text-primary hover:text-primary/80 transition-smooth font-medium">
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityFeed;