import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateRangeFilter = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('last30days');

  const dateRanges = [
    { id: 'today', label: 'Today', value: 'today' },
    { id: 'yesterday', label: 'Yesterday', value: 'yesterday' },
    { id: 'last7days', label: 'Last 7 Days', value: 'last7days' },
    { id: 'last30days', label: 'Last 30 Days', value: 'last30days' },
    { id: 'thisMonth', label: 'This Month', value: 'thisMonth' },
    { id: 'lastMonth', label: 'Last Month', value: 'lastMonth' },
    { id: 'thisQuarter', label: 'This Quarter', value: 'thisQuarter' },
    { id: 'thisYear', label: 'This Year', value: 'thisYear' }
  ];

  const handleApply = () => {
    if (onApply) {
      onApply(selectedRange);
    }
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    const range = dateRanges?.find(r => r?.value === selectedRange);
    return range ? range?.label : 'Select Range';
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        iconName="Calendar"
        iconPosition="left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getSelectedLabel()}
      </Button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-lg z-50">
            <div className="p-4 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground">Select Date Range</h4>
            </div>
            
            <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
              {dateRanges?.map((range) => (
                <button
                  key={range?.id}
                  onClick={() => setSelectedRange(range?.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-smooth ${
                    selectedRange === range?.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                  }`}
                >
                  <span className="text-sm font-medium">{range?.label}</span>
                  {selectedRange === range?.value && (
                    <Icon name="Check" size={16} />
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-border flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApply}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;