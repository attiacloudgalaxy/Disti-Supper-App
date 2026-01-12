import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DealStatusBadge from './DealStatusBadge';

const DealsTable = ({ deals, onDealSelect, onBulkAction, selectedDeals, onSelectionChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedDeals = [...deals]?.sort((a, b) => {
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aString = String(aValue)?.toLowerCase();
    const bString = String(bValue)?.toLowerCase();
    
    if (sortConfig?.direction === 'asc') {
      return aString?.localeCompare(bString);
    }
    return bString?.localeCompare(aString);
  });

  const totalPages = Math.ceil(sortedDeals?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeals = sortedDeals?.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      onSelectionChange(paginatedDeals?.map(deal => deal?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectDeal = (dealId) => {
    if (selectedDeals?.includes(dealId)) {
      onSelectionChange(selectedDeals?.filter(id => id !== dealId));
    } else {
      onSelectionChange([...selectedDeals, dealId]);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const columns = [
    { key: 'name', label: 'Opportunity Name', sortable: true },
    { key: 'value', label: 'Deal Value', sortable: true },
    { key: 'stage', label: 'Stage', sortable: true },
    { key: 'partner', label: 'Partner', sortable: true },
    { key: 'probability', label: 'Probability', sortable: true },
    { key: 'closeDate', label: 'Expected Close', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm overflow-hidden">
      {selectedDeals?.length > 0 && (
        <div className="bg-primary/10 border-b border-border px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">
            {selectedDeals?.length} {selectedDeals?.length === 1 ? 'deal' : 'deals'} selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowRight"
              iconPosition="left"
              onClick={() => onBulkAction('move-stage')}
            >
              Move Stage
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="UserPlus"
              iconPosition="left"
              onClick={() => onBulkAction('assign-partner')}
            >
              Assign Partner
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              iconPosition="left"
              onClick={() => onBulkAction('generate-quote')}
            >
              Generate Quote
            </Button>
          </div>
        </div>
      )}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedDeals?.length === paginatedDeals?.length && paginatedDeals?.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  aria-label="Select all deals"
                />
              </th>
              {columns?.map(column => (
                <th
                  key={column?.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                >
                  {column?.sortable ? (
                    <button
                      onClick={() => handleSort(column?.key)}
                      className="flex items-center space-x-2 hover:text-primary transition-smooth"
                    >
                      <span>{column?.label}</span>
                      <Icon
                        name={sortConfig?.key === column?.key && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                        size={16}
                        className={sortConfig?.key === column?.key ? 'text-primary' : 'text-muted-foreground'}
                      />
                    </button>
                  ) : (
                    <span>{column?.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedDeals?.map(deal => (
              <tr
                key={deal?.id}
                className="hover:bg-muted/30 transition-smooth cursor-pointer"
                onClick={() => onDealSelect(deal)}
              >
                <td className="px-6 py-4" onClick={(e) => e?.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedDeals?.includes(deal?.id)}
                    onChange={() => handleSelectDeal(deal?.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    aria-label={`Select ${deal?.name}`}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{deal?.name}</div>
                  <div className="caption text-muted-foreground">{deal?.company}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{formatCurrency(deal?.value)}</div>
                </td>
                <td className="px-6 py-4">
                  <DealStatusBadge stage={deal?.stage} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{deal?.partner}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${deal?.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      {deal?.probability}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{formatDate(deal?.closeDate)}</div>
                </td>
                <td className="px-6 py-4" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 hover:bg-muted rounded-lg transition-smooth"
                      aria-label="Edit deal"
                    >
                      <Icon name="Edit" size={16} className="text-muted-foreground" />
                    </button>
                    <button
                      className="p-2 hover:bg-muted rounded-lg transition-smooth"
                      aria-label="More options"
                    >
                      <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden divide-y divide-border">
        {paginatedDeals?.map(deal => (
          <div
            key={deal?.id}
            className="p-4 hover:bg-muted/30 transition-smooth"
            onClick={() => onDealSelect(deal)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedDeals?.includes(deal?.id)}
                  onChange={() => handleSelectDeal(deal?.id)}
                  onClick={(e) => e?.stopPropagation()}
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary flex-shrink-0"
                  aria-label={`Select ${deal?.name}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground mb-1">{deal?.name}</div>
                  <div className="caption text-muted-foreground mb-2">{deal?.company}</div>
                  <DealStatusBadge stage={deal?.stage} size="sm" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <div className="caption text-muted-foreground mb-1">Deal Value</div>
                <div className="font-semibold text-foreground">{formatCurrency(deal?.value)}</div>
              </div>
              <div>
                <div className="caption text-muted-foreground mb-1">Partner</div>
                <div className="text-sm text-foreground">{deal?.partner}</div>
              </div>
              <div>
                <div className="caption text-muted-foreground mb-1">Probability</div>
                <div className="text-sm font-medium text-foreground">{deal?.probability}%</div>
              </div>
              <div>
                <div className="caption text-muted-foreground mb-1">Close Date</div>
                <div className="text-sm text-foreground">{formatDate(deal?.closeDate)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="border-t border-border px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="caption text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedDeals?.length)} of {sortedDeals?.length} deals
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-smooth ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconPosition="right"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsTable;