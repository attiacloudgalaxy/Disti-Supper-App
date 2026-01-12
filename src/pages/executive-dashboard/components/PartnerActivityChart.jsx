import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PartnerActivityChart = ({ data, loading }) => {
  const COLORS = [
    'var(--color-success)',
    'var(--color-primary)',
    'var(--color-accent)',
    'var(--color-warning)',
    'var(--color-secondary)'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-1">{payload?.[0]?.name}</p>
          <p className="caption text-muted-foreground">
            Partners: <span className="font-medium text-foreground">{payload?.[0]?.value}</span>
          </p>
          <p className="caption text-muted-foreground">
            Percentage: <span className="font-medium text-foreground">{payload?.[0]?.payload?.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="skeleton h-8 w-48 rounded mb-4" />
        <div className="skeleton h-64 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Partner Activity Distribution</h3>
        <button className="caption text-primary hover:text-primary/80 transition-smooth">
          View All
        </button>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Partner Activity Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PartnerActivityChart;