import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const QuoteSummary = ({ 
  quoteItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onApplyDiscount,
  discount,
  onGenerateQuote 
}) => {
  const calculateSubtotal = () => {
    return quoteItems?.reduce((sum, item) => sum + (item?.partnerPrice * item?.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (discount / 100);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    return (subtotal - discountAmount) * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discountAmount + tax;
  };

  const calculateMargin = () => {
    const subtotal = calculateSubtotal();
    const cost = quoteItems?.reduce((sum, item) => sum + (item?.basePrice * item?.quantity), 0);
    return subtotal > 0 ? ((subtotal - cost) / subtotal * 100)?.toFixed(2) : 0;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-border">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">Quote Summary</h2>
        <p className="caption text-muted-foreground mt-1">
          {quoteItems?.length} {quoteItems?.length === 1 ? 'item' : 'items'} added
        </p>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
        {quoteItems?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No items added to quote yet</p>
            <p className="caption text-muted-foreground mt-2">
              Select products from the catalog to begin
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quoteItems?.map((item) => (
              <div
                key={item?.id}
                className="bg-surface border border-border rounded-lg p-4 hover:shadow-elevation-sm transition-smooth"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 mb-1">
                      {item?.name}
                    </h3>
                    <p className="caption text-muted-foreground">SKU: {item?.sku}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item?.id)}
                    className="flex-shrink-0 p-1 text-error hover:bg-error/10 rounded transition-smooth"
                    aria-label="Remove item"
                  >
                    <Icon name="Trash2" size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="caption text-muted-foreground">Unit Price:</span>
                  <span className="text-sm font-medium text-foreground">
                    ${item?.partnerPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="caption text-muted-foreground">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item?.id, Math.max(1, item?.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 rounded transition-smooth"
                      aria-label="Decrease quantity"
                    >
                      <Icon name="Minus" size={16} />
                    </button>
                    <span className="w-12 text-center font-medium text-foreground">
                      {item?.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item?.id, Math.min(item?.stock, item?.quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 rounded transition-smooth"
                      disabled={item?.quantity >= item?.stock}
                      aria-label="Increase quantity"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Line Total:</span>
                  <span className="text-base md:text-lg font-semibold text-primary">
                    ${(item?.partnerPrice * item?.quantity)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {quoteItems?.length > 0 && (
        <div className="border-t border-border p-4 md:p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal:</span>
              <span className="text-sm font-medium text-foreground">
                ${calculateSubtotal()?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Discount ({discount}%):</span>
              <span className="text-sm font-medium text-success">
                -${calculateDiscount()?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tax (8%):</span>
              <span className="text-sm font-medium text-foreground">
                ${calculateTax()?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-base md:text-lg font-semibold text-foreground">Total:</span>
              <span className="text-xl md:text-2xl font-bold text-primary">
                ${calculateTotal()?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="caption text-muted-foreground">Estimated Margin:</span>
              <span className="caption font-medium text-success">{calculateMargin()}%</span>
            </div>
          </div>

          <Button
            variant="default"
            size="lg"
            fullWidth
            iconName="FileText"
            iconPosition="left"
            onClick={onGenerateQuote}
          >
            Generate Quote
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuoteSummary;