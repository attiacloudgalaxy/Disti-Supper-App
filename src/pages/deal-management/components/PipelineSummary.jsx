import React from 'react';
import Icon from '../../../components/AppIcon';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PipelineSummary = ({ deals }) => {
  const calculateMetrics = () => {
    const totalValue = deals?.reduce((sum, deal) => sum + deal?.value, 0);
    const avgDealSize = deals?.length > 0 ? totalValue / deals?.length : 0;
    const weightedValue = deals?.reduce((sum, deal) => sum + (deal?.value * deal?.probability / 100), 0);
    
    const stageDistribution = deals?.reduce((acc, deal) => {
      const stage = deal?.stage;
      if (!acc?.[stage]) {
        acc[stage] = { count: 0, value: 0 };
      }
      acc[stage].count += 1;
      acc[stage].value += deal?.value;
      return acc;
    }, {});

    return {
      totalValue,
      avgDealSize,
      weightedValue,
      totalDeals: deals?.length,
      stageDistribution
    };
  };

  const metrics = calculateMetrics();

  const stageColors = {
    'prospecting': '#3B82F6',
    'qualification': '#8B5CF6',
    'proposal': '#F59E0B',
    'negotiation': '#10B981',
    'closed-won': '#38A169',
    'closed-lost': '#E53E3E'
  };

  const chartData = Object.entries(metrics?.stageDistribution)?.map(([stage, data]) => ({
    name: stage?.split('-')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' '),
    value: data?.count,
    fill: stageColors?.[stage] || '#6B7280'
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const summaryCards = [
    {
      label: 'Total Pipeline Value',
      value: formatCurrency(metrics?.totalValue),
      icon: 'DollarSign',
      color: 'primary',
      trend: '+12.5%'
    },
    {
      label: 'Weighted Pipeline',
      value: formatCurrency(metrics?.weightedValue),
      icon: 'TrendingUp',
      color: 'success',
      trend: '+8.3%'
    },
    {
      label: 'Average Deal Size',
      value: formatCurrency(metrics?.avgDealSize),
      icon: 'Target',
      color: 'accent',
      trend: '+5.2%'
    },
    {
      label: 'Total Opportunities',
      value: metrics?.totalDeals?.toString(),
      icon: 'Briefcase',
      color: 'secondary',
      trend: '+15'
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards?.map((card, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `var(--color-${card?.color})`, opacity: 0.1 }}
              >
                <Icon
                  name={card?.icon}
                  size={20}
                  color={`var(--color-${card?.color})`}
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-success">
                {card?.trend}
              </span>
            </div>
            <div className="caption text-muted-foreground mb-1">
              {card?.label}
            </div>
            <div className="text-xl md:text-2xl font-semibold text-foreground">
              {card?.value}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="PieChart" size={20} className="text-primary" />
          <h3 className="text-base md:text-lg font-semibold text-foreground">
            Pipeline Distribution by Stage
          </h3>
        </div>
        
        {chartData?.length > 0 ? (
          <div className="w-full h-64 md:h-80" aria-label="Pipeline distribution pie chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="PieChart" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineSummary;