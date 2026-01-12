import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';

import Button from '../../components/ui/Button';
import DealFilters from './components/DealFilters';
import PipelineSummary from './components/PipelineSummary';
import DealsTable from './components/DealsTable';
import DealDetailModal from './components/DealDetailModal';
import AddDealModal from './components/AddDealModal';
import { dealService } from '../../services/dealService';

const DealManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showPipelineSummary, setShowPipelineSummary] = useState(true);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({ name: 'User', email: 'user@example.com' });

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    const { data, error } = await dealService?.getAll();
    if (error) {
      setError(error?.message || 'Failed to load deals');
    } else {
      setDeals(data || []);
    }
    setLoading(false);
  };

  const filterDeals = (dealsToFilter) => {
    return dealsToFilter?.filter(deal => {
      if (filters?.stage && deal?.stage !== filters?.stage) return false;
      if (filters?.partner && deal?.partner !== filters?.partner) return false;
      if (filters?.valueMin && deal?.value < parseFloat(filters?.valueMin)) return false;
      if (filters?.valueMax && deal?.value > parseFloat(filters?.valueMax)) return false;
      if (filters?.dateFrom && new Date(deal.closeDate) < new Date(filters.dateFrom)) return false;
      if (filters?.dateTo && new Date(deal.closeDate) > new Date(filters.dateTo)) return false;
      if (filters?.probability) {
        const [min, max] = filters?.probability?.split('-')?.map(Number);
        if (deal?.probability < min || deal?.probability > max) return false;
      }
      return true;
    });
  };

  const filteredDeals = filterDeals(deals);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDealSelect = (deal) => {
    setSelectedDeal(deal);
  };

  const handleDealUpdate = async (updatedDeal) => {
    const { data, error } = await dealService?.update(selectedDeal?.id, updatedDeal);
    if (error) {
      alert('Failed to update deal: ' + error?.message);
    } else {
      setDeals(deals?.map(deal => deal?.id === data?.id ? data : deal));
      setSelectedDeal(null);
    }
  };

  const handleAddDeal = async (newDeal) => {
    const { data, error } = await dealService?.create(newDeal);
    if (error) {
      alert('Failed to add deal: ' + error?.message);
    } else {
      setDeals([data, ...deals]);
      setShowAddDealModal(false);
    }
  };

  const handleBulkAction = (action) => {
    // TODO: Implement - console.log(`Bulk action: ${action} for deals:`, selectedDeals);
    setSelectedDeals([]);
  };

  const handleSelectionChange = (selected) => {
    setSelectedDeals(selected);
  };

  useEffect(() => {
    document.title = 'Deal Management - DistributorHub';
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-250 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}
      >
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-elevation-sm">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <BreadcrumbNavigation />
              <div className="flex items-center space-x-3">
                <NotificationCenter />
                <UserProfileDropdown user={user} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                  Deal Management
                </h1>
                <p className="text-muted-foreground">
                  Track and manage your sales pipeline
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  onClick={() => setShowPipelineSummary(!showPipelineSummary)}
                >
                  {showPipelineSummary ? 'Hide' : 'Show'} Pipeline
                </Button>
                <Button onClick={() => setShowAddDealModal(true)}>
                  Add Deal
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading deals...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-error">{error}</p>
              </div>
            ) : (
              <>
                {showPipelineSummary && <PipelineSummary deals={deals} />}
                <DealFilters onFilterChange={handleFilterChange} resultCount={filteredDeals?.length || 0} />
                <DealsTable
                  deals={filteredDeals}
                  selectedDeals={selectedDeals}
                  onDealSelect={handleDealSelect}
                  onSelectChange={setSelectedDeals}
                  onBulkAction={handleBulkAction}
                  onSelectionChange={handleSelectionChange}
                />
              </>
            )}
          </div>
        </main>

        <QuickActionToolbar />
      </div>
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdate={handleDealUpdate}
        />
      )}
      {showAddDealModal && (
        <AddDealModal
          onClose={() => setShowAddDealModal(false)}
          onAdd={handleAddDeal}
        />
      )}
    </div>
  );
};

export default DealManagement;