import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';

import Button from '../../components/ui/Button';
import KPICard from './components/KPICard';
import DealPipelineChart from './components/DealPipelineChart';
import RevenueChart from './components/RevenueChart';
import PartnerActivityChart from './components/PartnerActivityChart';
import ActivityFeed from './components/ActivityFeed';
import QuickStats from './components/QuickStats';
import DateRangeFilter from './components/DateRangeFilter';
import { dealService } from '../../services/dealService';
import { partnerService } from '../../services/partnerService';
import { complianceService } from '../../services/complianceService';

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deals, setDeals] = useState([]);
  const [partners, setPartners] = useState([]);
  const [compliance, setCompliance] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [dealsResult, partnersResult, complianceResult] = await Promise.all([
      dealService?.getAll(),
      partnerService?.getAll(),
      complianceService?.getAll()
    ]);
    
    if (dealsResult?.data) setDeals(dealsResult?.data);
    if (partnersResult?.data) setPartners(partnersResult?.data);
    if (complianceResult?.data) setCompliance(complianceResult?.data);
    
    setLoading(false);
  };

  const totalRevenue = deals?.reduce((sum, deal) => sum + (deal?.value || 0), 0);
  const pipelineValue = deals?.filter(d => d?.stage !== 'closed_won' && d?.stage !== 'closed_lost')?.reduce((sum, deal) => sum + (deal?.value || 0), 0);
  const activePartners = partners?.filter(p => p?.status === 'Active')?.length || 0;
  const complianceScore = compliance?.length > 0 ? ((compliance?.filter(c => c?.status === 'compliant')?.length / compliance?.length) * 100)?.toFixed(1) : 0;

  const kpiData = [
    {
      id: 1,
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000000)?.toFixed(1)}M`,
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign',
      iconColor: 'var(--color-success)',
      trend: 'up'
    },
    {
      id: 2,
      title: 'Deal Pipeline Value',
      value: `$${(pipelineValue / 1000000)?.toFixed(1)}M`,
      change: '+8.3%',
      changeType: 'positive',
      icon: 'TrendingUp',
      iconColor: 'var(--color-primary)',
      trend: 'up'
    },
    {
      id: 3,
      title: 'Active Partners',
      value: activePartners?.toString(),
      change: '+15.2%',
      changeType: 'positive',
      icon: 'Users',
      iconColor: 'var(--color-accent)',
      trend: 'up'
    },
    {
      id: 4,
      title: 'Compliance Score',
      value: `${complianceScore}%`,
      change: '-2.1%',
      changeType: 'negative',
      icon: 'Shield',
      iconColor: 'var(--color-warning)',
      trend: 'down'
    }
  ];

  const pipelineData = [
    { stage: 'Prospecting', deals: deals?.filter(d => d?.stage === 'prospecting')?.length || 0, value: (deals?.filter(d => d?.stage === 'prospecting')?.reduce((sum, d) => sum + d?.value, 0) / 1000000) || 0 },
    { stage: 'Qualification', deals: deals?.filter(d => d?.stage === 'qualification')?.length || 0, value: (deals?.filter(d => d?.stage === 'qualification')?.reduce((sum, d) => sum + d?.value, 0) / 1000000) || 0 },
    { stage: 'Proposal', deals: deals?.filter(d => d?.stage === 'proposal')?.length || 0, value: (deals?.filter(d => d?.stage === 'proposal')?.reduce((sum, d) => sum + d?.value, 0) / 1000000) || 0 },
    { stage: 'Negotiation', deals: deals?.filter(d => d?.stage === 'negotiation')?.length || 0, value: (deals?.filter(d => d?.stage === 'negotiation')?.reduce((sum, d) => sum + d?.value, 0) / 1000000) || 0 },
    { stage: 'Closed Won', deals: deals?.filter(d => d?.stage === 'closed_won')?.length || 0, value: (deals?.filter(d => d?.stage === 'closed_won')?.reduce((sum, d) => sum + d?.value, 0) / 1000000) || 0 }
  ];

  const revenueData = [
    { month: 'Jan', actual: 2.1, forecast: 2.0 },
    { month: 'Feb', actual: 2.3, forecast: 2.2 },
    { month: 'Mar', actual: 2.5, forecast: 2.4 },
    { month: 'Apr', actual: 2.8, forecast: 2.6 },
    { month: 'May', actual: 3.1, forecast: 2.8 },
    { month: 'Jun', actual: 3.4, forecast: 3.2 },
    { month: 'Jul', actual: null, forecast: 3.5 },
    { month: 'Aug', actual: null, forecast: 3.8 },
    { month: 'Sep', actual: null, forecast: 4.0 }
  ];

  const partnerActivityData = [
    { name: 'Highly Active', value: partners?.filter(p => p?.performanceScore >= 90)?.length || 0, percentage: 24.9 },
    { name: 'Active', value: partners?.filter(p => p?.performanceScore >= 75 && p?.performanceScore < 90)?.length || 0, percentage: 41.5 },
    { name: 'Moderate', value: partners?.filter(p => p?.performanceScore >= 60 && p?.performanceScore < 75)?.length || 0, percentage: 22.8 },
    { name: 'Low Activity', value: partners?.filter(p => p?.performanceScore >= 40 && p?.performanceScore < 60)?.length || 0, percentage: 8.2 },
    { name: 'Inactive', value: partners?.filter(p => p?.performanceScore < 40)?.length || 0, percentage: 2.6 }
  ];

  const activities = [
    {
      id: 1,
      type: 'deal',
      title: 'High-Value Deal Approved',
      description: 'Deal with TechCorp Solutions has been approved and moved to contract stage',
      timestamp: '5 minutes ago',
      user: 'Sarah Johnson',
      priority: 'high'
    },
    {
      id: 2,
      type: 'compliance',
      title: 'Quarterly Audit Due',
      description: 'Q1 2026 compliance audit documentation submission deadline is in 3 days',
      timestamp: '1 hour ago',
      user: 'System',
      priority: 'high'
    },
    {
      id: 3,
      type: 'partner',
      title: 'New Partner Registration',
      description: 'GlobalTech Solutions has completed registration and awaiting approval',
      timestamp: '2 hours ago',
      user: 'Michael Chen',
      priority: 'medium'
    }
  ];

  const quickStats = [
    { id: 1, label: 'Open Deals', value: deals?.filter(d => d?.stage !== 'closed_won' && d?.stage !== 'closed_lost')?.length?.toString() || '0', icon: 'Briefcase', change: '+8', changeType: 'positive' },
    { id: 2, label: 'Pending Quotes', value: '42', icon: 'FileText', change: '+5', changeType: 'positive' },
    { id: 3, label: 'New Partners', value: partners?.length?.toString() || '0', icon: 'UserPlus', change: '+3', changeType: 'positive' },
    { id: 4, label: 'Compliance Issues', value: compliance?.filter(c => c?.status === 'overdue')?.length?.toString() || '0', icon: 'AlertTriangle', change: '-2', changeType: 'positive' }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData()?.then(() => setRefreshing(false));
  };

  const handleExport = () => {
    // TODO: Implement - console.log('Exporting dashboard data...');
  };

  const handleDateRangeApply = (range) => {
    // TODO: Implement - console.log('Date range applied:', range);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div 
        className={`transition-all duration-250 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}
      >
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-elevation-sm">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                Executive Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                iconName={refreshing ? 'Loader2' : 'RefreshCw'}
                onClick={handleRefresh}
                className={refreshing ? 'animate-spin' : ''}
              />
              <NotificationCenter />
              <UserProfileDropdown propUser={currentUser} />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <BreadcrumbNavigation />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <DateRangeFilter onApply={handleDateRangeApply} />
              <Button
                variant="outline"
                size="default"
                iconName="Download"
                iconPosition="left"
                onClick={handleExport}
              >
                Export Report
              </Button>
              <Button
                variant="default"
                size="default"
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => navigate('/analytics-and-reporting')}
              >
                View Analytics
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {kpiData?.map((kpi) => (
                  <KPICard key={kpi?.id} {...kpi} />
                ))}
              </div>

              <QuickStats stats={quickStats} loading={loading} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <DealPipelineChart data={pipelineData} loading={loading} />
                <RevenueChart data={revenueData} loading={loading} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2">
                  <ActivityFeed activities={activities} loading={loading} />
                </div>
                <div className="lg:col-span-1">
                  <PartnerActivityChart data={partnerActivityData} loading={loading} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Quick Navigation
                    </h3>
                    <p className="caption text-muted-foreground">
                      Access key operational areas
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Briefcase"
                      iconPosition="left"
                      onClick={() => navigate('/deal-management')}
                    >
                      Deals
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Users"
                      iconPosition="left"
                      onClick={() => navigate('/partner-portal')}
                    >
                      Partners
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Package"
                      iconPosition="left"
                      onClick={() => navigate('/inventory-management')}
                    >
                      Inventory
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Shield"
                      iconPosition="left"
                      onClick={() => navigate('/compliance-tracking')}
                    >
                      Compliance
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <QuickActionToolbar />

        <footer className="border-t border-border bg-card mt-12">
          <div className="px-4 md:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="caption text-muted-foreground text-center md:text-left">
                © {new Date()?.getFullYear()} DistributorHub. All rights reserved.
              </div>
              <div className="flex items-center space-x-6">
                <button className="caption text-muted-foreground hover:text-foreground transition-smooth">
                  Privacy Policy
                </button>
                <button className="caption text-muted-foreground hover:text-foreground transition-smooth">
                  Terms of Service
                </button>
                <button className="caption text-muted-foreground hover:text-foreground transition-smooth">
                  Support
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;