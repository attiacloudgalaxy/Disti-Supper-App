import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceUpdates = ({ updates }) => {
  const getUpdateTypeColor = (type) => {
    const colors = {
      completed: 'var(--color-success)',
      alert: 'var(--color-warning)',
      violation: 'var(--color-error)',
      update: 'var(--color-primary)'
    };
    return colors?.[type] || 'var(--color-muted-foreground)';
  };

  const getUpdateIcon = (type) => {
    const icons = {
      completed: 'CheckCircle2',
      alert: 'AlertTriangle',
      violation: 'XCircle',
      update: 'Info'
    };
    return icons?.[type] || 'Circle';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Updates</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Latest compliance activities and changes
        </p>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto custom-scrollbar">
        {updates?.map((update) => (
          <div
            key={update?.id}
            className="p-4 md:p-6 hover:bg-muted/30 transition-smooth"
          >
            <div className="flex items-start space-x-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${getUpdateTypeColor(update?.type)}15` }}
              >
                <Icon
                  name={getUpdateIcon(update?.type)}
                  size={20}
                  color={getUpdateTypeColor(update?.type)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                    {update?.title}
                  </h4>
                  <span className="flex-shrink-0 ml-2 text-xs text-muted-foreground whitespace-nowrap">
                    {getTimeAgo(update?.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {update?.description}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{update?.user}</span>
                  </div>
                  {update?.department && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Building2" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{update?.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceUpdates;