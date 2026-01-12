import React from 'react';
import Icon from '../../../components/AppIcon';

const AllocationSummary = ({ summary }) => {
  const summaryCards = [
    {
      label: 'Total Inventory Value',
      value: summary?.totalValue,
      icon: 'DollarSign',
      color: 'primary',
      trend: summary?.valueTrend
    },
    {
      label: 'Active Allocations',
      value: summary?.activeAllocations,
      icon: 'Users',
      color: 'secondary',
      trend: summary?.allocationTrend
    },
    {
      label: 'Pending Transfers',
      value: summary?.pendingTransfers,
      icon: 'ArrowRightLeft',
      color: 'accent',
      trend: summary?.transferTrend
    },
    {
      label: 'Reorder Required',
      value: summary?.reorderRequired,
      icon: 'RefreshCw',
      color: 'warning',
      trend: summary?.reorderTrend
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {summaryCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-smooth"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="caption text-muted-foreground mb-2">{card?.label}</p>
              <p className="text-2xl md:text-3xl font-semibold text-foreground data-text">
                {card?.value}
              </p>
              {card?.trend && (
                <div className="flex items-center gap-1.5 mt-3">
                  <Icon
                    name={card?.trend?.direction === 'up' ? 'TrendingUp' : 'TrendingDown'}
                    size={16}
                    className={card?.trend?.direction === 'up' ? 'text-success' : 'text-error'}
                  />
                  <span
                    className={`text-sm font-medium ${
                      card?.trend?.direction === 'up' ? 'text-success' : 'text-error'
                    }`}
                  >
                    {card?.trend?.percentage}%
                  </span>
                  <span className="caption text-muted-foreground">vs last month</span>
                </div>
              )}
            </div>
            <div
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `var(--color-${card?.color})15` }}
            >
              <Icon name={card?.icon} size={24} color={`var(--color-${card?.color})`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllocationSummary;