import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import ComplianceDashboard from './components/ComplianceDashboard';
import ComplianceTable from './components/ComplianceTable';
import ComplianceFilters from './components/ComplianceFilters';
import UpcomingAudits from './components/UpcomingAudits';
import ComplianceUpdates from './components/ComplianceUpdates';
import RegulatoryAlerts from './components/RegulatoryAlerts';
import Button from '../../components/ui/Button';
import { complianceService } from '../../services/complianceService';

const ComplianceTracking = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    department: 'all',
    priority: 'all',
    fromDate: '',
    toDate: '',
    search: ''
  });
  const [complianceRequirements, setComplianceRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [audits, setAudits] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState({ name: 'User', email: 'user@example.com' });

  useEffect(() => {
    loadCompliance();
  }, []);

  const loadCompliance = async () => {
    setLoading(true);
    const { data, error } = await complianceService?.getAll();
    if (error) {
      setError(error?.message || 'Failed to load compliance data');
    } else {
      setComplianceRequirements(data || []);
    }
    setLoading(false);
  };

  const dashboardData = [
    {
      id: 1,
      label: "Total Requirements",
      value: complianceRequirements?.length?.toString() || "0",
      statusLabel: "Active",
      status: "compliant",
      progress: 87,
      trend: 5,
      icon: "Shield"
    },
    {
      id: 2,
      label: "Pending Actions",
      value: complianceRequirements?.filter(c => c?.status === 'in-progress')?.length?.toString() || "0",
      statusLabel: "Attention",
      status: "warning",
      progress: 65,
      trend: -3,
      icon: "AlertTriangle"
    },
    {
      id: 3,
      label: "Overdue Items",
      value: complianceRequirements?.filter(c => c?.status === 'overdue')?.length?.toString() || "0",
      statusLabel: "Critical",
      status: "violation",
      progress: 45,
      trend: -12,
      icon: "XCircle"
    },
    {
      id: 4,
      label: "Compliant Items",
      value: complianceRequirements?.filter(c => c?.status === 'compliant')?.length?.toString() || "0",
      statusLabel: "Good",
      status: "compliant",
      progress: 75,
      trend: 8,
      icon: "Calendar"
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      department: 'all',
      priority: 'all',
      fromDate: '',
      toDate: '',
      search: ''
    });
  };

  const handleViewDetails = (requirement) => {
    // TODO: Implement - console.log('View requirement details:', requirement);
  };

  const handleAssignTask = (requirement) => {
    // TODO: Implement - console.log('Assign task:', requirement);
  };

  const handleUploadDocument = (requirement) => {
    // TODO: Implement - console.log('Upload document for:', requirement);
  };

  const handleScheduleAudit = () => {
    // TODO: Implement - console.log('Schedule new audit');
  };

  const handleViewAudit = (audit) => {
    // TODO: Implement - console.log('View audit details:', audit);
  };

  const handleViewAlert = (alert) => {
    // TODO: Implement - console.log('View alert details:', alert);
  };

  const handleDismissAlert = (alertId) => {
    // TODO: Implement - console.log('Dismiss alert:', alertId);
  };

  const filteredRequirements = complianceRequirements?.filter(req => {
    if (filters?.type !== 'all' && req?.type?.toLowerCase() !== filters?.type) return false;
    if (filters?.status !== 'all' && req?.status !== filters?.status) return false;
    if (filters?.department !== 'all' && req?.department?.toLowerCase() !== filters?.department) return false;
    if (filters?.priority !== 'all' && req?.priority !== filters?.priority) return false;
    if (filters?.search && !req?.requirement?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
      !req?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
      !req?.responsible?.toLowerCase()?.includes(filters?.search?.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`transition-all duration-250 ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[240px]'
          }`}
      >
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="hidden lg:block">
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                  Compliance Tracking
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor regulatory compliance and audit requirements
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                className="hidden md:flex"
              >
                Export Report
              </Button>
              <NotificationCenter />
              <UserProfileDropdown user={user} />
            </div>
          </div>

          <div className="px-4 md:px-6 lg:px-8">
            <BreadcrumbNavigation />
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex-1 overflow-auto">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Compliance Tracking
                  </h1>
                  <p className="text-muted-foreground">
                    Monitor regulatory compliance and audit requirements
                  </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <Button variant="outline" onClick={loadCompliance}>
                    Refresh
                  </Button>
                  <Button>
                    Generate Report
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading compliance data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-error">{error}</p>
                </div>
              ) : (
                <>
                  <ComplianceDashboard data={dashboardData} />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <ComplianceFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                        requirementCount={filteredRequirements?.length || 0}
                      />
                      <ComplianceTable
                        requirements={filteredRequirements}
                        filters={filters}
                        onViewDetails={handleViewDetails}
                        onAssignTask={handleAssignTask}
                        onUploadDocument={handleUploadDocument}
                      />
                    </div>
                    <div className="space-y-6">
                      <UpcomingAudits
                        audits={audits}
                        onScheduleAudit={handleScheduleAudit}
                        onViewAudit={handleViewAudit}
                      />
                      <ComplianceUpdates updates={updates} />
                      <RegulatoryAlerts
                        alerts={alerts}
                        onViewAlert={handleViewAlert}
                        onDismissAlert={handleDismissAlert}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        <QuickActionToolbar />
      </div>
    </div>
  );
};

export default ComplianceTracking;