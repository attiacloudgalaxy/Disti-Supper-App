import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PerformanceAnalyticsPanel = () => {
  const revenueData = [
  { month: 'Jan', revenue: 245000 },
  { month: 'Feb', revenue: 312000 },
  { month: 'Mar', revenue: 289000 },
  { month: 'Apr', revenue: 356000 },
  { month: 'May', revenue: 398000 },
  { month: 'Jun', revenue: 421000 }];


  const tierDistribution = [
  { name: 'Platinum', value: 12, color: 'var(--color-primary)' },
  { name: 'Gold', value: 28, color: 'var(--color-warning)' },
  { name: 'Silver', value: 45, color: 'var(--color-muted-foreground)' },
  { name: 'Bronze', value: 38, color: 'var(--color-accent)' }];


  const topPerformers = [
  {
    name: 'TechCorp Solutions',
    revenue: 1250000,
    deals: 45,
    growth: '+28%',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_17b4dce52-1764654560254.png",
    logoAlt: 'TechCorp Solutions company logo with blue and white corporate branding'
  },
  {
    name: 'GlobalTech Partners',
    revenue: 980000,
    deals: 38,
    growth: '+22%',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_173f325e8-1768193356677.png",
    logoAlt: 'GlobalTech Partners modern logo design with green technology theme'
  },
  {
    name: 'Innovation Systems',
    revenue: 875000,
    deals: 32,
    growth: '+19%',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_170e8f619-1768193357997.png",
    logoAlt: 'Innovation Systems abstract logo with orange and gray color scheme'
  }];


  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
          <Icon name="TrendingUp" size={20} className="text-success" />
        </div>
        <div className="w-full h-64" aria-label="Partner Revenue Trend Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }} />

              <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Tier Distribution</h3>
            <Icon name="PieChart" size={20} className="text-primary" />
          </div>
          <div className="w-full h-64" aria-label="Partner Tier Distribution Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">

                  {tierDistribution?.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }} />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Top Performers</h3>
            <Icon name="Award" size={20} className="text-warning" />
          </div>
          <div className="space-y-4">
            {topPerformers?.map((partner, index) =>
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-semibold text-primary">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">
                      {partner?.name}
                    </div>
                    <div className="caption text-muted-foreground">
                      {partner?.deals} deals
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-sm font-semibold text-foreground whitespace-nowrap">
                    ${(partner?.revenue / 1000)?.toFixed(0)}K
                  </div>
                  <div className="caption text-success">{partner?.growth}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

};

export default PerformanceAnalyticsPanel;