import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegulatoryAlerts = ({ alerts, onViewAlert, onDismissAlert }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'var(--color-error)',
      high: 'var(--color-warning)',
      medium: 'var(--color-secondary)',
      low: 'var(--color-success)'
    };
    return colors?.[priority] || 'var(--color-muted-foreground)';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      critical: 'AlertOctagon',
      high: 'AlertTriangle',
      medium: 'AlertCircle',
      low: 'Info'
    };
    return icons?.[priority] || 'Bell';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Regulatory Alerts</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {alerts?.length} active alert{alerts?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-warning" />
            {alerts?.filter(a => a?.priority === 'critical')?.length > 0 && (
              <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto custom-scrollbar">
        {alerts?.map((alert) => (
          <div
            key={alert?.id}
            className="p-4 md:p-6 hover:bg-muted/30 transition-smooth"
          >
            <div className="flex items-start space-x-3">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${getPriorityColor(alert?.priority)}15` }}
              >
                <Icon
                  name={getPriorityIcon(alert?.priority)}
                  size={24}
                  color={getPriorityColor(alert?.priority)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                    {alert?.title}
                  </h4>
                  <span
                    className="flex-shrink-0 ml-2 text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${getPriorityColor(alert?.priority)}15`,
                      color: getPriorityColor(alert?.priority)
                    }}
                  >
                    {alert?.priorityLabel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {alert?.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Effective: {alert?.effectiveDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Deadline: {alert?.deadline}
                    </span>
                  </div>
                </div>

                {alert?.impactedAreas && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">Impacted Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {alert?.impactedAreas?.map((area, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-muted rounded-full text-foreground"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => onViewAlert(alert)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => onDismissAlert(alert?.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegulatoryAlerts;