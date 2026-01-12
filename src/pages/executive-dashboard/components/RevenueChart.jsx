import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RevenueChart = ({ data, loading }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-2">{payload?.[0]?.payload?.month}</p>
          <div className="space-y-1">
            <p className="caption text-success">
              Actual: <span className="font-medium">${payload?.[0]?.value}M</span>
            </p>
            <p className="caption text-primary">
              Forecast: <span className="font-medium">${payload?.[1]?.value}M</span>
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
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Revenue Forecast</h3>
        <div className="flex items-center space-x-2">
          <button className="caption text-muted-foreground hover:text-foreground transition-smooth px-3 py-1 rounded-lg hover:bg-muted">
            Monthly
          </button>
          <button className="caption text-primary bg-primary/10 px-3 py-1 rounded-lg">
            Quarterly
          </button>
        </div>
      </div>
      
      <div className="w-full h-64 md:h-80" aria-label="Revenue Forecast Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <YAxis 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="var(--color-border)"
              label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', fill: 'var(--color-text-secondary)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="var(--color-success)"
              strokeWidth={2}
              fill="url(#colorActual)"
              name="Actual Revenue"
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="var(--color-primary)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorForecast)"
              name="Forecasted Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;