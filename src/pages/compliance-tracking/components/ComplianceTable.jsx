import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceTable = ({ requirements, onViewDetails, onAssignTask, onUploadDocument }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'var(--color-success)',
      'in-progress': 'var(--color-warning)',
      overdue: 'var(--color-error)',
      pending: 'var(--color-secondary)'
    };
    return colors?.[status] || 'var(--color-muted-foreground)';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'var(--color-error)',
      high: 'var(--color-warning)',
      medium: 'var(--color-secondary)',
      low: 'var(--color-success)'
    };
    return colors?.[priority] || 'var(--color-muted-foreground)';
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedRequirements = [...requirements]?.sort((a, b) => {
    if (sortConfig?.key === 'dueDate') {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortConfig?.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig?.key === 'requirement') {
      return sortConfig?.direction === 'asc'
        ? a?.requirement?.localeCompare(b?.requirement)
        : b?.requirement?.localeCompare(a?.requirement);
    }
    return 0;
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 md:px-6 py-3 md:py-4">
                <button
                  onClick={() => handleSort('requirement')}
                  className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  <span>Requirement</span>
                  <Icon
                    name={sortConfig?.key === 'requirement' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'}
                    size={16}
                  />
                </button>
              </th>
              <th className="text-left px-4 md:px-6 py-3 md:py-4">
                <span className="text-sm font-semibold text-foreground">Type</span>
              </th>
              <th className="text-left px-4 md:px-6 py-3 md:py-4">
                <span className="text-sm font-semibold text-foreground">Responsible</span>
              </th>
              <th className="text-left px-4 md:px-6 py-3 md:py-4">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  <span>Due Date</span>
                  <Icon
                    name={sortConfig?.key === 'dueDate' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'}
                    size={16}
                  />
                </button>
              </th>
              <th className="text-left px-4 md:px-6 py-3 md:py-4">
                <span className="text-sm font-semibold text-foreground">Priority</span>
              </th>
              <th className="text-left px-4 md:px-6 py-3 md:py-4">
                <span className="text-sm font-semibold text-foreground">Status</span>
              </th>
              <th className="text-left px-4 md:px-6 py-3 md:py-4">
                <span className="text-sm font-semibold text-foreground">Progress</span>
              </th>
              <th className="text-right px-4 md:px-6 py-3 md:py-4">
                <span className="text-sm font-semibold text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedRequirements?.map((req) => (
              <tr key={req?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${getStatusColor(req?.status)}15` }}
                    >
                      <Icon name={req?.icon} size={20} color={getStatusColor(req?.status)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {req?.requirement}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {req?.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className="text-sm text-foreground">{req?.type}</span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {req?.responsible?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{req?.responsible}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className="text-sm text-foreground whitespace-nowrap">{req?.dueDate}</span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getPriorityColor(req?.priority)}15`,
                      color: getPriorityColor(req?.priority)
                    }}
                  >
                    {req?.priority}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(req?.status)}15`,
                      color: getStatusColor(req?.status)
                    }}
                  >
                    {req?.statusLabel}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden min-w-[60px]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${req?.progress}%`,
                          backgroundColor: getStatusColor(req?.status)
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {req?.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(req)}
                      className="hover:bg-muted"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="UserPlus"
                      onClick={() => onAssignTask(req)}
                      className="hover:bg-muted"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Upload"
                      onClick={() => onUploadDocument(req)}
                      className="hover:bg-muted"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceTable;