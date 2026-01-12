import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportBuilder = ({ onClose, onGenerate }) => {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [format, setFormat] = useState('pdf');

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'partner', label: 'Partner Performance' },
    { value: 'deal', label: 'Deal Pipeline' },
    { value: 'inventory', label: 'Inventory Analysis' },
    { value: 'compliance', label: 'Compliance Report' }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const metrics = [
    { id: 'revenue', label: 'Total Revenue' },
    { id: 'deals', label: 'Deal Count' },
    { id: 'partners', label: 'Active Partners' },
    { id: 'conversion', label: 'Conversion Rate' },
    { id: 'margin', label: 'Profit Margin' },
    { id: 'growth', label: 'Growth Rate' }
  ];

  const groupByOptions = [
    { value: 'day', label: 'By Day' },
    { value: 'week', label: 'By Week' },
    { value: 'month', label: 'By Month' },
    { value: 'partner', label: 'By Partner' },
    { value: 'product', label: 'By Product' },
    { value: 'region', label: 'By Region' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'json', label: 'JSON Data' }
  ];

  const handleMetricToggle = (metricId) => {
    setSelectedMetrics(prev => 
      prev?.includes(metricId) 
        ? prev?.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleGenerate = () => {
    const reportConfig = {
      name: reportName,
      type: reportType,
      dateRange,
      metrics: selectedMetrics,
      groupBy,
      format
    };
    onGenerate(reportConfig);
  };

  return (
    <div className="fixed inset-0 bg-background/80 z-[300] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-semibold text-foreground">Build Custom Report</h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          <Input
            label="Report Name"
            type="text"
            placeholder="Enter report name"
            value={reportName}
            onChange={(e) => setReportName(e?.target?.value)}
            required
          />

          <Select
            label="Report Type"
            options={reportTypes}
            value={reportType}
            onChange={setReportType}
            placeholder="Select report type"
            required
          />

          <Select
            label="Date Range"
            options={dateRanges}
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select date range"
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Metrics
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metrics?.map((metric) => (
                <Checkbox
                  key={metric?.id}
                  label={metric?.label}
                  checked={selectedMetrics?.includes(metric?.id)}
                  onChange={() => handleMetricToggle(metric?.id)}
                />
              ))}
            </div>
          </div>

          <Select
            label="Group By"
            options={groupByOptions}
            value={groupBy}
            onChange={setGroupBy}
            placeholder="Select grouping"
          />

          <Select
            label="Export Format"
            options={formatOptions}
            value={format}
            onChange={setFormat}
            placeholder="Select format"
            required
          />
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="FileText"
            iconPosition="left"
            onClick={handleGenerate}
            disabled={!reportName || !reportType || !dateRange || selectedMetrics?.length === 0}
          >
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;