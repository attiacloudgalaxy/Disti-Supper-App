import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ComplianceFilters = ({ filters, onFilterChange, onReset, requirementCount }) => {
  const complianceTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'regulatory', label: 'Regulatory' },
    { value: 'security', label: 'Security' },
    { value: 'financial', label: 'Financial' },
    { value: 'operational', label: 'Operational' },
    { value: 'data-privacy', label: 'Data Privacy' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'pending', label: 'Pending' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'it', label: 'IT' },
    { value: 'legal', label: 'Legal' },
    { value: 'hr', label: 'Human Resources' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Filter Compliance</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {requirementCount} requirement{requirementCount !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Compliance Type"
          options={complianceTypeOptions}
          value={filters?.type}
          onChange={(value) => onFilterChange('type', value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          label="Department"
          options={departmentOptions}
          value={filters?.department}
          onChange={(value) => onFilterChange('department', value)}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={filters?.priority}
          onChange={(value) => onFilterChange('priority', value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          type="date"
          label="From Date"
          value={filters?.fromDate}
          onChange={(e) => onFilterChange('fromDate', e?.target?.value)}
        />

        <Input
          type="date"
          label="To Date"
          value={filters?.toDate}
          onChange={(e) => onFilterChange('toDate', e?.target?.value)}
        />
      </div>
      <div className="mt-4">
        <Input
          type="search"
          placeholder="Search requirements, descriptions, or responsible parties..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />
      </div>
    </div>
  );
};

export default ComplianceFilters;