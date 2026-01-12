import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricCard from './components/MetricCard';
import ChartWidget from './components/ChartWidget';
import ReportBuilder from './components/ReportBuilder';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';

import { dealService } from '../../services/dealService';
import { partnerService } from '../../services/partnerService';

const AnalyticsAndReporting = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [deals, setDeals] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    const [dealsResult, partnersResult] = await Promise.all([
      dealService?.getAll(),
      partnerService?.getAll()
    ]);
    
    if (dealsResult?.data) setDeals(dealsResult?.data);
    if (partnersResult?.data) setPartners(partnersResult?.data);
    setLoading(false);
  };

  const totalRevenue = deals?.reduce((sum, deal) => sum + (deal?.value || 0), 0);
  const activeDeals = deals?.filter(d => d?.stage !== 'closed_won' && d?.stage !== 'closed_lost')?.length || 0;
  const avgPartnerPerformance = partners?.length > 0 ? (partners?.reduce((sum, p) => sum + (p?.performanceScore || 0), 0) / partners?.length)?.toFixed(1) : 0;
  const conversionRate = deals?.length > 0 ? ((deals?.filter(d => d?.stage === 'closed_won')?.length / deals?.length) * 100)?.toFixed(1) : 0;

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000000)?.toFixed(1)}M`,
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign',
      iconColor: 'var(--color-success)',
      trend: 'vs last month',
      description: 'This month'
    },
    {
      title: 'Active Deals',
      value: activeDeals?.toString(),
      change: '+8.3%',
      changeType: 'positive',
      icon: 'Briefcase',
      iconColor: 'var(--color-primary)',
      trend: 'vs last month',
      description: 'In pipeline'
    },
    {
      title: 'Partner Performance',
      value: `${avgPartnerPerformance}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: 'Users',
      iconColor: 'var(--color-accent)',
      trend: 'avg score',
      description: 'Overall rating'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '-2.1%',
      changeType: 'negative',
      icon: 'TrendingUp',
      iconColor: 'var(--color-warning)',
      trend: 'vs last month',
      description: 'Deal closure'
    }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 185000, deals: 45, margin: 28 },
    { name: 'Feb', revenue: 220000, deals: 52, margin: 32 },
    { name: 'Mar', revenue: 195000, deals: 48, margin: 29 },
    { name: 'Apr', revenue: 245000, deals: 58, margin: 35 },
    { name: 'May', revenue: 280000, deals: 65, margin: 38 },
    { name: 'Jun', revenue: 310000, deals: 72, margin: 42 }
  ];

  const partnerPerformanceData = partners?.slice(0, 5)?.map(p => ({
    name: p?.companyName,
    value: p?.revenue || 0
  })) || [];

  const dealPipelineData = [
    { name: 'Q1', qualified: 45, proposal: 32, negotiation: 18, closed: 28 },
    { name: 'Q2', qualified: 52, proposal: 38, negotiation: 24, closed: 35 },
    { name: 'Q3', qualified: 48, proposal: 35, negotiation: 22, closed: 31 },
    { name: 'Q4', qualified: 58, proposal: 42, negotiation: 28, closed: 38 }
  ];

  const topPartnersColumns = [
    { key: 'partner', label: 'Partner Name' },
    { 
      key: 'revenue', 
      label: 'Revenue',
      render: (value) => `$${(value / 1000)?.toFixed(0)}K`
    },
    { key: 'deals', label: 'Deals' },
    { 
      key: 'growth', 
      label: 'Growth',
      render: (value) => (
        <span className={value >= 0 ? 'text-success' : 'text-error'}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      )
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Icon name="Star" size={14} color="var(--color-warning)" />
          <span>{value}</span>
        </div>
      )
    }
  ];

  const topPartnersData = [
    { partner: 'TechCorp Solutions', revenue: 450000, deals: 28, growth: 15.2, rating: 4.8 },
    { partner: 'GlobalTech Partners', revenue: 380000, deals: 24, growth: 12.8, rating: 4.6 },
    { partner: 'Innovate Systems', revenue: 320000, deals: 19, growth: 8.5, rating: 4.5 },
    { partner: 'Digital Dynamics', revenue: 280000, deals: 16, growth: 10.3, rating: 4.4 },
    { partner: 'Cloud Solutions Inc', revenue: 245000, deals: 15, growth: 6.7, rating: 4.3 },
    { partner: 'Enterprise Tech', revenue: 210000, deals: 13, growth: 5.2, rating: 4.2 },
    { partner: 'Smart Systems', revenue: 185000, deals: 11, growth: 4.8, rating: 4.1 },
    { partner: 'Tech Innovators', revenue: 165000, deals: 10, growth: 3.5, rating: 4.0 }
  ];

  const handleGenerateReport = (reportConfig) => {
    // TODO: Implement - console.log('Generating report with config:', reportConfig);
    setShowReportBuilder(false);
  };

  const handleApplyFilters = (filters) => {
    // TODO: Implement - console.log('Applying filters:', filters);
  };

  const handleResetFilters = () => {
    // TODO: Implement - console.log('Resetting filters');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'revenue', label: 'Revenue Analysis', icon: 'DollarSign' },
    { id: 'partners', label: 'Partner Performance', icon: 'Users' },
    { id: 'deals', label: 'Deal Pipeline', icon: 'Briefcase' },
    { id: 'scheduled', label: 'Scheduled Reports', icon: 'Clock' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <NavigationSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div 
        className={`flex-1 transition-all duration-250 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}
      >
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-elevation-sm">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary)15' }}
                >
                  <Icon name="BarChart3" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                    Analytics & Reporting
                  </h1>
                  <p className="caption text-muted-foreground hidden md:block">
                    Business intelligence and performance insights
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                onClick={() => setShowReportBuilder(true)}
                className="hidden md:flex"
              >
                Build Report
              </Button>
              <NotificationCenter />
              <UserProfileDropdown propUser={{ name: 'User', email: 'user@example.com' }} />
            </div>
          </div>

          <div className="px-4 md:px-6 lg:px-8">
            <BreadcrumbNavigation />
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <FilterPanel 
              onApplyFilters={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading analytics...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {keyMetrics?.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWidget
                  title="Revenue Trend"
                  chartType="line"
                  data={revenueData}
                  dataKeys={['revenue', 'margin']}
                  colors={['var(--color-primary)', 'var(--color-success)']}
                  height={300}
                />

                <ChartWidget
                  title="Partner Distribution"
                  chartType="pie"
                  data={partnerPerformanceData}
                  dataKeys={['value']}
                  colors={[
                    'var(--color-primary)',
                    'var(--color-secondary)',
                    'var(--color-accent)',
                    'var(--color-success)',
                    'var(--color-warning)'
                  ]}
                  height={300}
                />
              </div>

              <ChartWidget
                title="Deal Pipeline Analysis"
                chartType="bar"
                data={dealPipelineData}
                dataKeys={['qualified', 'proposal', 'negotiation', 'closed']}
                colors={[
                  'var(--color-primary)',
                  'var(--color-secondary)',
                  'var(--color-warning)',
                  'var(--color-success)'
                ]}
                height={350}
              />

              <DataTable
                title="Top Performing Partners"
                columns={topPartnersColumns}
                data={topPartnersData}
              />
            </>
          )}
        </main>

        <QuickActionToolbar />
      </div>
      {showReportBuilder && (
        <ReportBuilder
          onClose={() => setShowReportBuilder(false)}
          onGenerate={handleGenerateReport}
        />
      )}
    </div>
  );
};

export default AnalyticsAndReporting;