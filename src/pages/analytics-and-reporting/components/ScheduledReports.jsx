import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduledReports = () => {
  const [reports] = useState([
    {
      id: 1,
      name: 'Weekly Revenue Summary',
      frequency: 'Weekly',
      nextRun: '2026-01-19',
      recipients: ['john@distributorhub.com', 'sarah@distributorhub.com'],
      format: 'PDF',
      status: 'active'
    },
    {
      id: 2,
      name: 'Monthly Partner Performance',
      frequency: 'Monthly',
      nextRun: '2026-02-01',
      recipients: ['management@distributorhub.com'],
      format: 'Excel',
      status: 'active'
    },
    {
      id: 3,
      name: 'Quarterly Compliance Report',
      frequency: 'Quarterly',
      nextRun: '2026-04-01',
      recipients: ['compliance@distributorhub.com', 'legal@distributorhub.com'],
      format: 'PDF',
      status: 'active'
    },
    {
      id: 4,
      name: 'Daily Deal Pipeline',
      frequency: 'Daily',
      nextRun: '2026-01-13',
      recipients: ['sales@distributorhub.com'],
      format: 'CSV',
      status: 'paused'
    }
  ]);

  const getFrequencyIcon = (frequency) => {
    const icons = {
      'Daily': 'Calendar',
      'Weekly': 'CalendarDays',
      'Monthly': 'CalendarRange',
      'Quarterly': 'CalendarClock'
    };
    return icons?.[frequency] || 'Calendar';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'var(--color-success)' : 'var(--color-warning)';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Clock" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Scheduled Reports</h3>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
        >
          New Schedule
        </Button>
      </div>
      <div className="divide-y divide-border">
        {reports?.map((report) => (
          <div 
            key={report?.id}
            className="p-4 md:p-6 hover:bg-muted/30 transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-base font-semibold text-foreground">
                    {report?.name}
                  </h4>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${getStatusColor(report?.status)}15`,
                      color: getStatusColor(report?.status)
                    }}
                  >
                    {report?.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 caption text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name={getFrequencyIcon(report?.frequency)} size={14} />
                    <span>{report?.frequency}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={14} />
                    <span>Next: {report?.nextRun}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={14} />
                    <span>{report?.format}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Edit"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName={report?.status === 'active' ? 'Pause' : 'Play'}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Trash2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border">
              <Icon name="Users" size={14} className="text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {report?.recipients?.map((recipient, index) => (
                  <span 
                    key={index}
                    className="caption text-muted-foreground bg-muted px-2 py-1 rounded"
                  >
                    {recipient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledReports;