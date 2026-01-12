import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import UserProfileDropdown from '../../components/navigation/UserProfileDropdown';
import NotificationCenter from '../../components/navigation/NotificationCenter';
import BreadcrumbNavigation from '../../components/navigation/BreadcrumbNavigation';
import QuickActionToolbar from '../../components/navigation/QuickActionToolbar';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import InventoryAlerts from './components/InventoryAlerts';
import AllocationSummary from './components/AllocationSummary';
import DemandForecast from './components/DemandForecast';
import AllocationModal from './components/AllocationModal';
import TransferModal from './components/TransferModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { productService } from '../../services/productService';

const InventoryManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await productService?.getAll();
    if (error) {
      setError(error?.message || 'Failed to load products');
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setLoading(false);
  };

  // Add this block - mock user data for UserProfileDropdown
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    role: 'Inventory Manager'
  };

  const mockAlerts = [
    {
      id: 1,
      type: 'out-of-stock',
      title: 'Critical Stock Alert',
      message: 'Palo Alto PA-5220 Firewall is out of stock. Immediate reorder required.',
      timestamp: '10 minutes ago',
      priority: 'high',
      actionable: true
    },
    {
      id: 2,
      type: 'low-stock',
      title: 'Low Stock Warning',
      message: 'Cisco Catalyst 9300 Switch inventory below threshold (8 units remaining).',
      timestamp: '1 hour ago',
      priority: 'medium',
      actionable: true
    },
    {
      id: 3,
      type: 'reorder',
      title: 'Reorder Recommendation',
      message: 'Microsoft SQL Server licenses trending high demand. Consider bulk reorder.',
      timestamp: '2 hours ago',
      priority: 'medium',
      actionable: true
    },
    {
      id: 4,
      type: 'allocation',
      title: 'Allocation Pending Approval',
      message: 'TechCorp Solutions allocation request for 25 Dell R740 servers awaiting approval.',
      timestamp: '3 hours ago',
      priority: 'low',
      actionable: true
    },
    {
      id: 5,
      type: 'out-of-stock',
      title: 'Stock Depleted',
      message: 'Arista 7280R3 Switch completely allocated. No available inventory.',
      timestamp: '5 hours ago',
      priority: 'high',
      actionable: true
    }
  ];

  const mockSummary = {
    totalValue: '$8.4M',
    valueTrend: { direction: 'up', percentage: 12 },
    activeAllocations: 342,
    allocationTrend: { direction: 'up', percentage: 8 },
    pendingTransfers: 28,
    transferTrend: { direction: 'down', percentage: 5 },
    reorderRequired: 15,
    reorderTrend: { direction: 'up', percentage: 20 }
  };

  const mockForecastData = [
    { month: 'Jan', actual: 2400, forecast: 2500 },
    { month: 'Feb', actual: 2800, forecast: 2900 },
    { month: 'Mar', actual: 3200, forecast: 3100 },
    { month: 'Apr', actual: 2900, forecast: 3300 },
    { month: 'May', actual: null, forecast: 3500 },
    { month: 'Jun', actual: null, forecast: 3800 }
  ];

  const mockTopProducts = [
    { name: 'Dell R740', units: 145 },
    { name: 'Cisco C9300', units: 128 },
    { name: 'MS SQL 2022', units: 112 },
    { name: 'VMware vSphere', units: 98 },
    { name: 'HPE DL380', units: 87 }
  ];

  const handleFilterChange = (filters) => {
    let filtered = [...products];

    // Fix: Use 'searchQuery' key that InventoryFilters sends
    if (filters?.searchQuery) {
      const searchLower = filters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(p =>
        p?.name?.toLowerCase()?.includes(searchLower) ||
        p?.sku?.toLowerCase()?.includes(searchLower) ||
        p?.manufacturer?.toLowerCase()?.includes(searchLower)
      );
    }

    // Fix: Match the category filter values from InventoryFilters
    // Use case-insensitive partial match since filter uses 'servers' but data has 'Servers & Storage'
    if (filters?.category && filters?.category !== '') {
      const categoryLower = filters?.category?.toLowerCase();
      filtered = filtered?.filter(p =>
        p?.category?.toLowerCase()?.includes(categoryLower) ||
        categoryLower?.includes(p?.category?.toLowerCase()?.split(' ')[0])
      );
    }

    // Fix: Add manufacturer filter support
    if (filters?.manufacturer && filters?.manufacturer !== '') {
      filtered = filtered?.filter(p => p?.manufacturer?.toLowerCase()?.includes(filters?.manufacturer));
    }

    // Fix: Use 'availability' key that InventoryFilters sends
    if (filters?.availability && filters?.availability !== '') {
      if (filters?.availability === 'low-stock') {
        filtered = filtered?.filter(p => p?.available > 0 && p?.available <= (p?.lowStockThreshold || 10));
      } else if (filters?.availability === 'out-of-stock') {
        filtered = filtered?.filter(p => p?.available === 0);
      } else if (filters?.availability === 'in-stock') {
        filtered = filtered?.filter(p => p?.available > (p?.lowStockThreshold || 10));
      } else if (filters?.availability === 'allocated') {
        filtered = filtered?.filter(p => p?.allocated > 0);
      }
    }

    // Location filter - use partial matching
    if (filters?.location && filters?.location !== '') {
      const locationLower = filters?.location?.toLowerCase();
      filtered = filtered?.filter(p =>
        p?.location?.toLowerCase()?.includes(locationLower) ||
        locationLower?.includes(p?.location?.toLowerCase()?.split('-')[0])
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAllocate = (product) => {
    setSelectedProduct(product);
    setShowAllocationModal(true);
  };

  const handleTransfer = (product) => {
    setSelectedProduct(product);
    setShowTransferModal(true);
  };

  const handleViewDetails = (product) => {
    // TODO: Implement - console.log('View details for:', product);
  };

  const handleAllocationSubmit = (allocationData) => {
    // TODO: Implement - console.log('Allocation submitted:', allocationData);

    // Fix: Update products state to reflect allocation
    if (selectedProduct && allocationData?.quantity) {
      const quantity = parseInt(allocationData?.quantity, 10) || 0;
      const updatedProducts = products?.map(p => {
        if (p?.id === selectedProduct?.id || p?.sku === selectedProduct?.sku) {
          return {
            ...p,
            available: Math.max(0, (p?.available || 0) - quantity),
            allocated: (p?.allocated || 0) + quantity
          };
        }
        return p;
      });
      setProducts(updatedProducts);

      // Also update filtered products
      const updatedFiltered = filteredProducts?.map(p => {
        if (p?.id === selectedProduct?.id || p?.sku === selectedProduct?.sku) {
          return {
            ...p,
            available: Math.max(0, (p?.available || 0) - quantity),
            allocated: (p?.allocated || 0) + quantity
          };
        }
        return p;
      });
      setFilteredProducts(updatedFiltered);
    }

    setShowAllocationModal(false);
    setSelectedProduct(null);
  };

  const handleTransferSubmit = (transferData) => {
    // TODO: Implement - console.log('Transfer submitted:', transferData);
  };

  const lowStockCount = products?.filter(
    (p) => p?.available > 0 && p?.available <= p?.lowStockThreshold
  )?.length;
  const outOfStockCount = products?.filter((p) => p?.available === 0)?.length;

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`transition-all duration-250 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
          }`}
      >
        <header className="sticky top-0 z-[90] bg-card border-b border-border shadow-elevation-sm">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Package" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                  Inventory Management
                </h1>
                <p className="caption text-muted-foreground hidden md:block">
                  Real-time stock visibility and allocation control
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
              <UserProfileDropdown user={mockUser} />
            </div>
          </div>
          <div className="px-4 md:px-6 lg:px-8">
            <BreadcrumbNavigation />
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
          <AllocationSummary summary={mockSummary} />

          <InventoryFilters
            onFilterChange={handleFilterChange}
            totalProducts={products?.length}
            lowStockCount={lowStockCount}
            outOfStockCount={outOfStockCount}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <InventoryTable
                products={filteredProducts}
                onAllocate={handleAllocate}
                onTransfer={handleTransfer}
                onViewDetails={handleViewDetails}
              />
            </div>
            <div>
              <InventoryAlerts alerts={mockAlerts} />
            </div>
          </div>

          <DemandForecast forecastData={mockForecastData} topProducts={mockTopProducts} />
        </main>

        <QuickActionToolbar />
      </div>
      {showAllocationModal && selectedProduct && (
        <AllocationModal
          product={selectedProduct}
          onClose={() => setShowAllocationModal(false)}
          onAllocate={handleAllocationSubmit}
        />
      )}
      {showTransferModal && selectedProduct && (
        <TransferModal
          product={selectedProduct}
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransferSubmit}
        />
      )}
    </div>
  );
};

export default InventoryManagement;