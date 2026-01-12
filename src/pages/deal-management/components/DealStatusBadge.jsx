import React from 'react';

const DealStatusBadge = ({ stage, size = 'default' }) => {
  const stageConfig = {
    'prospecting': {
      label: 'Prospecting',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      icon: '🔍'
    },
    'qualification': {
      label: 'Qualification',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      icon: '✓'
    },
    'proposal': {
      label: 'Proposal',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      icon: '📄'
    },
    'negotiation': {
      label: 'Negotiation',
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      icon: '🤝'
    },
    'closed-won': {
      label: 'Closed Won',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      icon: '✅'
    },
    'closed-lost': {
      label: 'Closed Lost',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      icon: '❌'
    }
  };

  const config = stageConfig?.[stage] || stageConfig?.['prospecting'];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 rounded-full font-medium ${config?.color} ${sizeClasses?.[size]}`}
    >
      <span>{config?.icon}</span>
      <span>{config?.label}</span>
    </span>
  );
};

export default DealStatusBadge;