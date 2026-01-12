import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const DealFilters = ({ onFilterChange, resultCount }) => {
  const [filters, setFilters] = useState({
    stage: '',
    valueMin: '',
    valueMax: '',
    partner: '',
    dateFrom: '',
    dateTo: '',
    probability: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const stageOptions = [
    { value: '', label: 'All Stages' },
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  const partnerOptions = [
    { value: '', label: 'All Partners' },
    { value: 'techcorp', label: 'TechCorp Solutions' },
    { value: 'globaltech', label: 'GlobalTech Partners' },
    { value: 'innovate', label: 'Innovate Systems' },
    { value: 'digital', label: 'Digital Dynamics' },
    { value: 'enterprise', label: 'Enterprise Networks' }
  ];

  const probabilityOptions = [
    { value: '', label: 'All Probabilities' },
    { value: '0-25', label: '0-25%' },
    { value: '26-50', label: '26-50%' },
    { value: '51-75', label: '51-75%' },
    { value: '76-100', label: '76-100%' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      stage: '',
      valueMin: '',
      valueMax: '',
      partner: '',
      dateFrom: '',
      dateTo: '',
      probability: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm">
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-base md:text-lg font-semibold text-foreground">
            Filter Deals
          </h3>
          {resultCount !== undefined && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={handleReset}
            >
              Clear
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
          </button>
        </div>
      </div>
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block border-t border-border p-4 md:p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Select
            label="Deal Stage"
            options={stageOptions}
            value={filters?.stage}
            onChange={(value) => handleFilterChange('stage', value)}
            placeholder="Select stage"
          />

          <Select
            label="Partner"
            options={partnerOptions}
            value={filters?.partner}
            onChange={(value) => handleFilterChange('partner', value)}
            placeholder="Select partner"
            searchable
          />

          <Select
            label="Probability"
            options={probabilityOptions}
            value={filters?.probability}
            onChange={(value) => handleFilterChange('probability', value)}
            placeholder="Select probability"
          />

          <Input
            label="Min Value ($)"
            type="number"
            placeholder="0"
            value={filters?.valueMin}
            onChange={(e) => handleFilterChange('valueMin', e?.target?.value)}
            min="0"
          />

          <Input
            label="Max Value ($)"
            type="number"
            placeholder="1000000"
            value={filters?.valueMax}
            onChange={(e) => handleFilterChange('valueMax', e?.target?.value)}
            min="0"
          />

          <Input
            label="From Date"
            type="date"
            value={filters?.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />

          <Input
            label="To Date"
            type="date"
            value={filters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DealFilters;