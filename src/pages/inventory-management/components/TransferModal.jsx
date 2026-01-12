import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransferModal = ({ product, onClose, onTransfer }) => {
  const [formData, setFormData] = useState({
    fromLocation: product?.location,
    toLocation: '',
    quantity: '',
    reason: '',
    urgency: 'normal',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const locationOptions = [
    { value: 'warehouse-east', label: 'East Coast Warehouse' },
    { value: 'warehouse-west', label: 'West Coast Warehouse' },
    { value: 'warehouse-central', label: 'Central Distribution' },
    { value: 'warehouse-south', label: 'Southern Hub' }
  ]?.filter(loc => loc?.value !== product?.location);

  const reasonOptions = [
    { value: 'rebalancing', label: 'Stock Rebalancing' },
    { value: 'demand', label: 'High Demand Region' },
    { value: 'consolidation', label: 'Warehouse Consolidation' },
    { value: 'customer-request', label: 'Customer Request' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low - Standard Shipping' },
    { value: 'normal', label: 'Normal - 3-5 Business Days' },
    { value: 'high', label: 'High - 1-2 Business Days' },
    { value: 'urgent', label: 'Urgent - Same Day' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.toLocation) newErrors.toLocation = 'Destination location is required';
    if (!formData?.quantity) newErrors.quantity = 'Quantity is required';
    if (parseInt(formData?.quantity) > product?.available) {
      newErrors.quantity = `Cannot exceed available quantity (${product?.available})`;
    }
    if (parseInt(formData?.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData?.reason) newErrors.reason = 'Transfer reason is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }
    onTransfer({ ...formData, productId: product?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 z-[300] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Transfer Inventory</h2>
            <p className="caption text-muted-foreground mt-1">
              Move stock between warehouse locations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Package" size={24} className="text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {product?.name}
                </p>
                <p className="caption text-muted-foreground mt-1">SKU: {product?.sku}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="caption text-muted-foreground">
                    Available: <span className="data-text font-semibold text-foreground">{product?.available}</span>
                  </span>
                  <span className="caption text-muted-foreground">
                    Current Location: <span className="font-medium text-foreground">{product?.location}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="From Location"
                type="text"
                value={formData?.fromLocation}
                disabled
                description="Current warehouse location"
              />

              <Select
                label="To Location"
                description="Select destination warehouse"
                required
                options={locationOptions}
                value={formData?.toLocation}
                onChange={(value) => handleChange('toLocation', value)}
                error={errors?.toLocation}
              />
            </div>

            <Input
              label="Transfer Quantity"
              type="number"
              placeholder="Enter quantity to transfer"
              description={`Maximum available: ${product?.available} units`}
              required
              value={formData?.quantity}
              onChange={(e) => handleChange('quantity', e?.target?.value)}
              error={errors?.quantity}
              min="1"
              max={product?.available}
            />

            <Select
              label="Transfer Reason"
              description="Select the reason for this transfer"
              required
              options={reasonOptions}
              value={formData?.reason}
              onChange={(value) => handleChange('reason', value)}
              error={errors?.reason}
            />

            <Select
              label="Urgency Level"
              description="Set transfer priority and shipping speed"
              options={urgencyOptions}
              value={formData?.urgency}
              onChange={(value) => handleChange('urgency', value)}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Add any special handling instructions or additional details..."
                value={formData?.notes}
                onChange={(e) => handleChange('notes', e?.target?.value)}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
              />
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Transfer Approval Required</p>
                <p className="caption text-muted-foreground mt-1">
                  This transfer request will be submitted for approval. You will receive a notification once processed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="ArrowRightLeft"
              iconPosition="left"
            >
              Submit Transfer Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;