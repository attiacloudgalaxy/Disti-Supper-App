import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ onApplyFilters, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState({
    timePeriod: 'month',
    partner: '',
    productCategory: '',
    region: '',
    performanceMetric: '',
    minValue: '',
    maxValue: ''
  });

  const timePeriods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const partners = [
    { value: 'all', label: 'All Partners' },
    { value: 'techcorp', label: 'TechCorp Solutions' },
    { value: 'globaltech', label: 'GlobalTech Partners' },
    { value: 'innovate', label: 'Innovate Systems' },
    { value: 'digital', label: 'Digital Dynamics' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'software', label: 'Software' },
    { value: 'services', label: 'Services' },
    { value: 'cloud', label: 'Cloud Solutions' }
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north', label: 'North America' },
    { value: 'south', label: 'South America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia Pacific' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'deals', label: 'Deal Count' },
    { value: 'margin', label: 'Profit Margin' },
    { value: 'growth', label: 'Growth Rate' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      timePeriod: 'month',
      partner: '',
      productCategory: '',
      region: '',
      performanceMetric: '',
      minValue: '',
      maxValue: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-smooth"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-muted-foreground"
        />
      </div>
      {isExpanded && (
        <div className="p-4 md:p-6 border-t border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Time Period"
              options={timePeriods}
              value={filters?.timePeriod}
              onChange={(value) => handleFilterChange('timePeriod', value)}
            />

            <Select
              label="Partner"
              options={partners}
              value={filters?.partner}
              onChange={(value) => handleFilterChange('partner', value)}
              placeholder="Select partner"
            />

            <Select
              label="Product Category"
              options={categories}
              value={filters?.productCategory}
              onChange={(value) => handleFilterChange('productCategory', value)}
              placeholder="Select category"
            />

            <Select
              label="Region"
              options={regions}
              value={filters?.region}
              onChange={(value) => handleFilterChange('region', value)}
              placeholder="Select region"
            />

            <Select
              label="Performance Metric"
              options={metrics}
              value={filters?.performanceMetric}
              onChange={(value) => handleFilterChange('performanceMetric', value)}
              placeholder="Select metric"
            />

            <div className="flex items-end space-x-2">
              <Input
                label="Min Value"
                type="number"
                placeholder="0"
                value={filters?.minValue}
                onChange={(e) => handleFilterChange('minValue', e?.target?.value)}
              />
              <Input
                label="Max Value"
                type="number"
                placeholder="1000000"
                value={filters?.maxValue}
                onChange={(e) => handleFilterChange('maxValue', e?.target?.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset Filters
            </Button>
            <Button
              variant="default"
              iconName="Check"
              iconPosition="left"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;