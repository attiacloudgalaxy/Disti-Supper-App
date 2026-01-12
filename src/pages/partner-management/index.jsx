import React, { useState, useMemo, useEffect } from 'react';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PartnerStatsCard from './components/PartnerStatsCard';
import PartnerFilterBar from './components/PartnerFilterBar';
import PartnerTableRow from './components/PartnerTableRow';

import PartnerDetailsModal from './components/PartnerDetailsModal';
import PartnerModal from './components/PartnerModal';
import PerformanceAnalyticsPanel from './components/PerformanceAnalyticsPanel';
import { partnerService } from '../../services/partnerService';

const PartnerManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    search: '',
    tier: 'all',
    region: 'all',
    status: 'all',
    performance: 'all'
  });
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    const { data, error } = await partnerService?.getAll();
    if (error) {
      setError(error?.message || 'Failed to load partners');
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  const statsData = [
    {
      icon: 'Users',
      label: 'Total Partners',
      value: '123',
      change: '+12 this month',
      changeType: 'positive',
      color: 'primary'
    },
    {
      icon: 'TrendingUp',
      label: 'Active Partners',
      value: '108',
      change: '87.8% active rate',
      changeType: 'positive',
      color: 'success'
    },
    {
      icon: 'Award',
      label: 'Certified Partners',
      value: '89',
      change: '+8 this quarter',
      changeType: 'positive',
      color: 'warning'
    },
    {
      icon: 'DollarSign',
      label: 'Total Revenue',
      value: '$8.4M',
      change: '+18% vs last month',
      changeType: 'positive',
      color: 'accent'
    }];

  const filteredPartners = useMemo(() => {
    return partners?.filter(partner => {
      if (filters?.search && !partner?.companyName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !partner?.contactName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !partner?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }
      if (filters?.tier !== 'all' && partner?.tier !== filters?.tier) return false;
      if (filters?.region !== 'all' && partner?.region !== filters?.region) return false;
      if (filters?.status !== 'all' && partner?.status !== filters?.status) return false;
      if (filters?.performance !== 'all') {
        const score = partner?.performanceScore;
        if (filters?.performance === 'excellent' && score < 90) return false;
        if (filters?.performance === 'good' && (score < 75 || score >= 90)) return false;
        if (filters?.performance === 'average' && (score < 60 || score >= 75)) return false;
        if (filters?.performance === 'poor' && score >= 60) return false;
      }
      return true;
    });
  }, [partners, filters]);

  const sortedPartners = useMemo(() => {
    if (!sortConfig?.key) return filteredPartners;

    return [...filteredPartners]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredPartners, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      tier: 'all',
      region: 'all',
      status: 'all',
      performance: 'all'
    });
  };

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleAddPartner = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (editingPartner) {
      // Update existing partner
      const { error } = await partnerService?.update(editingPartner.id, formData);
      if (error) {
        alert('Failed to update partner: ' + error?.message);
      } else {
        await loadPartners();
        setIsModalOpen(false);
        setEditingPartner(null);
      }
    } else {
      // Create new partner
      const { error } = await partnerService?.create(formData);
      if (error) {
        alert('Failed to add partner: ' + error?.message);
      } else {
        await loadPartners();
        setIsModalOpen(false);
      }
    }
  };

  const handleDeletePartner = async (partnerId) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      const { error } = await partnerService?.delete(partnerId);
      if (error) {
        alert('Failed to delete partner: ' + error?.message);
      } else {
        setPartners(partners?.filter(p => p?.id !== partnerId));
      }
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ChevronsUpDown';
    return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div
        className={`transition-all duration-250 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`
        }>

        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-20">
            <div className="flex items-center space-x-4 flex-1">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                Partner Management
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName={showAnalytics ? 'Table' : 'BarChart3'}
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="hidden md:flex">

                {showAnalytics ? 'View Table' : 'View Analytics'}
              </Button>
              <NotificationCenter />
              <UserProfileDropdown user={{ name: 'Admin User', email: 'admin@example.com', avatar: '' }} />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6">
          <BreadcrumbNavigation />

          <div className="flex-1 overflow-auto">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Partner Management
                  </h1>
                  <p className="text-muted-foreground">
                    Manage and monitor your partner network performance
                  </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                  >
                    <Icon name="BarChart3" size={18} className="mr-2" />
                    {showAnalytics ? 'Hide' : 'Show'} Analytics
                  </Button>
                  <Button onClick={handleAddPartner}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Add Partner
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading partners...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-error">{error}</p>
                </div>
              ) : (
                <>
                  <PartnerStatsCard partners={partners} stats={statsData} />
                  <PartnerFilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    partners={partners}
                    partnerCount={filteredPartners?.length || 0}
                  />
                  {showAnalytics && (
                    <PerformanceAnalyticsPanel partners={filteredPartners} />
                  )}

                  {/* Partner Table */}
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th
                              className="text-left px-4 py-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              onClick={() => handleSort('companyName')}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Partner</span>
                                <Icon name={getSortIcon('companyName')} size={14} />
                              </div>
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Contact</th>
                            <th
                              className="text-left px-4 py-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              onClick={() => handleSort('tier')}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Tier</span>
                                <Icon name={getSortIcon('tier')} size={14} />
                              </div>
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Region</th>
                            <th
                              className="text-left px-4 py-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              onClick={() => handleSort('performanceScore')}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Performance</span>
                                <Icon name={getSortIcon('performanceScore')} size={14} />
                              </div>
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Certifications</th>
                            <th
                              className="text-left px-4 py-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              onClick={() => handleSort('status')}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Status</span>
                                <Icon name={getSortIcon('status')} size={14} />
                              </div>
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedPartners?.length > 0 ? (
                            sortedPartners.map((partner) => (
                              <PartnerTableRow
                                key={partner?.id || partner?.partnerId}
                                partner={partner}
                                onViewDetails={handleViewDetails}
                                onEditPartner={handleEditPartner}
                              />
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="px-4 py-12 text-center">
                                <div className="text-muted-foreground">
                                  <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
                                  <p className="text-lg font-medium">No partners found</p>
                                  <p className="text-sm mt-1">Try adjusting your filters or add a new partner</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        <QuickActionToolbar />
      </div>
      {selectedPartner && (
        <PartnerDetailsModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)} />

      )}
      {isModalOpen && (
        <PartnerModal
          partner={editingPartner}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit} />

      )}
    </div>);

};

export default PartnerManagement;