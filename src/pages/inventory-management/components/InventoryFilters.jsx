import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const InventoryFilters = ({ onFilterChange, totalProducts, lowStockCount, outOfStockCount }) => {
  const [filters, setFilters] = useState({
    category: '',
    manufacturer: '',
    availability: '',
    location: '',
    searchQuery: ''
  });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'servers', label: 'Servers & Storage' },
    { value: 'networking', label: 'Networking Equipment' },
    { value: 'software', label: 'Software Licenses' },
    { value: 'security', label: 'Security Solutions' },
    { value: 'cloud', label: 'Cloud Services' }
  ];

  const manufacturerOptions = [
    { value: '', label: 'All Manufacturers' },
    { value: 'dell', label: 'Dell Technologies' },
    { value: 'hp', label: 'HP Enterprise' },
    { value: 'cisco', label: 'Cisco Systems' },
    { value: 'microsoft', label: 'Microsoft' },
    { value: 'vmware', label: 'VMware' },
    { value: 'lenovo', label: 'Lenovo' }
  ];

  const availabilityOptions = [
    { value: '', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'allocated', label: 'Allocated' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'warehouse-east', label: 'East Coast Warehouse' },
    { value: 'warehouse-west', label: 'West Coast Warehouse' },
    { value: 'warehouse-central', label: 'Central Distribution' },
    { value: 'warehouse-south', label: 'Southern Hub' }
  ];

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      manufacturer: '',
      availability: '',
      location: '',
      searchQuery: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">Inventory Overview</h2>
            <p className="caption text-muted-foreground mt-1">Real-time stock visibility and allocation control</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Icon name="Package" size={18} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{totalProducts} Products</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={18} className="text-warning" />
              <span className="text-sm font-medium text-warning">{lowStockCount} Low Stock</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-error/10 rounded-lg">
              <Icon name="XCircle" size={18} className="text-error" />
              <span className="text-sm font-medium text-error">{outOfStockCount} Out of Stock</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <Input
              type="search"
              placeholder="Search by SKU, product name, or barcode..."
              value={filters?.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
              className="w-full"
            />
          </div>

          <Select
            placeholder="Category"
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
          />

          <Select
            placeholder="Manufacturer"
            options={manufacturerOptions}
            value={filters?.manufacturer}
            onChange={(value) => handleFilterChange('manufacturer', value)}
          />

          <Select
            placeholder="Availability"
            options={availabilityOptions}
            value={filters?.availability}
            onChange={(value) => handleFilterChange('availability', value)}
          />

          <Select
            placeholder="Location"
            options={locationOptions}
            value={filters?.location}
            onChange={(value) => handleFilterChange('location', value)}
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Active filters applied
            </p>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={handleReset}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryFilters;