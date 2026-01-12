import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryAlerts = ({ alerts }) => {
  const getAlertIcon = (type) => {
    const iconMap = {
      'low-stock': 'AlertTriangle',
      'out-of-stock': 'XCircle',
      'reorder': 'RefreshCw',
      'allocation': 'Users',
      'transfer': 'ArrowRightLeft'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getAlertColor = (priority) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'primary'
    };
    return colorMap?.[priority] || 'primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Inventory Alerts</h3>
            <p className="caption text-muted-foreground">Real-time notifications and warnings</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="Settings">
          Configure
        </Button>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto custom-scrollbar">
        {alerts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Icon name="CheckCircle" size={48} className="text-success mb-4" />
            <p className="text-foreground font-medium">All Clear</p>
            <p className="caption text-muted-foreground text-center mt-2">
              No inventory alerts at this time
            </p>
          </div>
        ) : (
          alerts?.map((alert) => {
            const color = getAlertColor(alert?.priority);
            return (
              <div key={alert?.id} className="p-4 hover:bg-muted/50 transition-smooth">
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `var(--color-${color})15` }}
                  >
                    <Icon
                      name={getAlertIcon(alert?.type)}
                      size={20}
                      color={`var(--color-${color})`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {alert?.title}
                        </p>
                        <p className="caption text-muted-foreground mt-1 line-clamp-2">
                          {alert?.message}
                        </p>
                      </div>
                      <span
                        className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: `var(--color-${color})15`,
                          color: `var(--color-${color})`
                        }}
                      >
                        {alert?.priority?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="caption text-muted-foreground">{alert?.timestamp}</span>
                      {alert?.actionable && (
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InventoryAlerts;