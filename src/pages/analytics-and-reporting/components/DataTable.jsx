import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataTable = ({ title, columns, data, allowExport = true }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data]?.sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a?.[sortColumn];
    const bValue = b?.[sortColumn];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortDirection === 'asc' 
      ? String(aValue)?.localeCompare(String(bValue))
      : String(bValue)?.localeCompare(String(aValue));
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    // TODO: Implement - console.log('Exporting table data:', title);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {allowExport && (
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
          >
            Export
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted transition-smooth"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column?.label}</span>
                    {sortColumn === column?.key && (
                      <Icon 
                        name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        size={16}
                        className="text-primary"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-muted/30 transition-smooth"
              >
                {columns?.map((column) => (
                  <td 
                    key={column?.key}
                    className="px-4 md:px-6 py-4 text-sm text-foreground"
                  >
                    {column?.render ? column?.render(row?.[column?.key], row) : row?.[column?.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="caption text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData?.length)} of {sortedData?.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />
            <span className="caption text-foreground px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;