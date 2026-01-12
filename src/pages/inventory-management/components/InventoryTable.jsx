import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryTable = ({ products, onAllocate, onTransfer, onViewDetails }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'sku', direction: 'asc' });
  const [selectedProducts, setSelectedProducts] = useState([]);

  const getAvailabilityStatus = (available, threshold) => {
    if (available === 0) {
      return { label: 'Out of Stock', color: 'error', bgColor: 'bg-error/10' };
    } else if (available <= threshold) {
      return { label: 'Low Stock', color: 'warning', bgColor: 'bg-warning/10' };
    }
    return { label: 'In Stock', color: 'success', bgColor: 'bg-success/10' };
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedProducts(products?.map(p => p?.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev?.includes(productId)
        ? prev?.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const sortedProducts = [...products]?.sort((a, b) => {
    if (sortConfig?.key === 'available' || sortConfig?.key === 'allocated') {
      return sortConfig?.direction === 'asc'
        ? a?.[sortConfig?.key] - b?.[sortConfig?.key]
        : b?.[sortConfig?.key] - a?.[sortConfig?.key];
    }
    return sortConfig?.direction === 'asc'
      ? String(a?.[sortConfig?.key])?.localeCompare(String(b?.[sortConfig?.key]))
      : String(b?.[sortConfig?.key])?.localeCompare(String(a?.[sortConfig?.key]));
  });

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts?.length === products?.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border"
                  aria-label="Select all products"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('sku')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  SKU
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Product Description
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Category
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('available')}
                  className="flex items-center justify-end gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth w-full"
                >
                  Available
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('allocated')}
                  className="flex items-center justify-end gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth w-full"
                >
                  Allocated
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-semibold text-foreground">Location</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-semibold text-foreground">Status</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-semibold text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProducts?.map((product) => {
              const status = getAvailabilityStatus(product?.available, product?.lowStockThreshold);
              return (
                <tr
                  key={product?.id}
                  className="hover:bg-muted/50 transition-smooth"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts?.includes(product?.id)}
                      onChange={() => handleSelectProduct(product?.id)}
                      className="w-4 h-4 rounded border-border"
                      aria-label={`Select ${product?.name}`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="data-text text-sm font-medium text-foreground">
                      {product?.sku}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {product?.name}
                      </p>
                      <p className="caption text-muted-foreground mt-1 line-clamp-1">
                        {product?.manufacturer}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-foreground">{product?.category}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="data-text text-sm font-semibold text-foreground">
                      {product?.available}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="data-text text-sm text-muted-foreground">
                      {product?.allocated}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{product?.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status?.bgColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-${status?.color}`} />
                      <span style={{ color: `var(--color-${status?.color})` }}>{status?.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onAllocate(product)}
                        className="p-1.5 hover:bg-primary/10 rounded transition-smooth"
                        title="Allocate Stock"
                        aria-label={`Allocate ${product?.name}`}
                      >
                        <Icon name="UserPlus" size={16} className="text-primary" />
                      </button>
                      <button
                        onClick={() => onTransfer(product)}
                        className="p-1.5 hover:bg-secondary/10 rounded transition-smooth"
                        title="Transfer Stock"
                        aria-label={`Transfer ${product?.name}`}
                      >
                        <Icon name="ArrowRightLeft" size={16} className="text-secondary" />
                      </button>
                      <button
                        onClick={() => onViewDetails(product)}
                        className="p-1.5 hover:bg-muted rounded transition-smooth"
                        title="View Details"
                        aria-label={`View details for ${product?.name}`}
                      >
                        <Icon name="Eye" size={16} className="text-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedProducts?.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-t border-border">
          <p className="text-sm font-medium text-foreground">
            {selectedProducts?.length} product{selectedProducts?.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="UserPlus"
              iconPosition="left"
            >
              Bulk Allocate
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowRightLeft"
              iconPosition="left"
            >
              Bulk Transfer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;