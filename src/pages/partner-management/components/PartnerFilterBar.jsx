import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PartnerFilterBar = ({ filters, onFilterChange, onClearFilters, partnerCount }) => {
  const tierOptions = [
    { value: 'all', label: 'All Tiers' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'bronze', label: 'Bronze' }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia-pacific', label: 'Asia Pacific' },
    { value: 'latin-america', label: 'Latin America' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'All Performance' },
    { value: 'excellent', label: 'Excellent (90%+)' },
    { value: 'good', label: 'Good (70-89%)' },
    { value: 'average', label: 'Average (50-69%)' },
    { value: 'poor', label: 'Poor (<50%)' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search partners..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
            className="w-full"
          />
          
          <Select
            options={tierOptions}
            value={filters?.tier}
            onChange={(value) => onFilterChange('tier', value)}
            placeholder="Select tier"
          />
          
          <Select
            options={regionOptions}
            value={filters?.region}
            onChange={(value) => onFilterChange('region', value)}
            placeholder="Select region"
          />
          
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="Select status"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="caption text-muted-foreground whitespace-nowrap">
            {partnerCount} {partnerCount === 1 ? 'partner' : 'partners'}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            onClick={onClearFilters}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Select
          options={performanceOptions}
          value={filters?.performance}
          onChange={(value) => onFilterChange('performance', value)}
          placeholder="Filter by performance"
          className="w-full md:w-64"
        />
      </div>
    </div>
  );
};

export default PartnerFilterBar;