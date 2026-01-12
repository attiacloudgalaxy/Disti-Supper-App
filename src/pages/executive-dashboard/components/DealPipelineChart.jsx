import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DealPipelineChart = ({ data, loading }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-2">{payload?.[0]?.payload?.stage}</p>
          <div className="space-y-1">
            <p className="caption text-muted-foreground">
              Deals: <span className="font-medium text-foreground">{payload?.[0]?.value}</span>
            </p>
            <p className="caption text-muted-foreground">
              Value: <span className="font-medium text-foreground">${payload?.[1]?.value}M</span>
            </p>
          </div>
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
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Deal Pipeline Progression</h3>
        <button className="caption text-primary hover:text-primary/80 transition-smooth">
          View Details
        </button>
      </div>
      
      <div className="w-full h-64 md:h-80" aria-label="Deal Pipeline Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="stage" 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <YAxis 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="deals" 
              fill="var(--color-primary)" 
              radius={[8, 8, 0, 0]}
              name="Number of Deals"
            />
            <Bar 
              dataKey="value" 
              fill="var(--color-accent)" 
              radius={[8, 8, 0, 0]}
              name="Value ($M)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DealPipelineChart;