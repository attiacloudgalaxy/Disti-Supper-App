import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';

const ChartWidget = ({ 
  title, 
  chartType, 
  data, 
  dataKeys,
  colors,
  height = 300,
  showLegend = true,
  showGrid = true,
  allowExport = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExport = () => {
    // TODO: Implement - console.log('Exporting chart data:', title);
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 20, left: 0, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />}
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            {showLegend && <Legend />}
            {dataKeys?.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colors?.[index]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />}
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            {showLegend && <Legend />}
            {dataKeys?.map((key, index) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={colors?.[index]}
                strokeWidth={2}
                dot={{ fill: colors?.[index], r: 4 }}
              />
            ))}
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          {allowExport && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={handleExport}
            >
              Export
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            iconName={isExpanded ? 'Minimize2' : 'Maximize2'}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>

      <div className="p-4 md:p-6">
        <ResponsiveContainer width="100%" height={isExpanded ? height * 1.5 : height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWidget;