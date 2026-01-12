import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceDashboard = ({ dashboardData }) => {
  const getStatusColor = (status) => {
    const colors = {
      compliant: 'var(--color-success)',
      warning: 'var(--color-warning)',
      violation: 'var(--color-error)',
      pending: 'var(--color-secondary)'
    };
    return colors?.[status] || 'var(--color-muted-foreground)';
  };

  const getStatusIcon = (status) => {
    const icons = {
      compliant: 'CheckCircle2',
      warning: 'AlertTriangle',
      violation: 'XCircle',
      pending: 'Clock'
    };
    return icons?.[status] || 'Circle';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {dashboardData?.map((item) => (
        <div
          key={item?.id}
          className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-elevation-md transition-smooth"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${getStatusColor(item?.status)}15` }}
            >
              <Icon
                name={getStatusIcon(item?.status)}
                size={24}
                color={getStatusColor(item?.status)}
              />
            </div>
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${getStatusColor(item?.status)}15`,
                color: getStatusColor(item?.status)
              }}
            >
              {item?.statusLabel}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            {item?.value}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{item?.label}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium">{item?.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item?.progress}%`,
                  backgroundColor: getStatusColor(item?.status)
                }}
              />
            </div>
          </div>

          {item?.trend && (
            <div className="flex items-center mt-4 text-xs">
              <Icon
                name={item?.trend > 0 ? 'TrendingUp' : 'TrendingDown'}
                size={14}
                color={item?.trend > 0 ? 'var(--color-success)' : 'var(--color-error)'}
              />
              <span
                className="ml-1 font-medium"
                style={{
                  color: item?.trend > 0 ? 'var(--color-success)' : 'var(--color-error)'
                }}
              >
                {Math.abs(item?.trend)}%
              </span>
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComplianceDashboard;