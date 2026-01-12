import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AllocationModal = ({ product, onClose, onAllocate }) => {
  const [formData, setFormData] = useState({
    partner: '',
    quantity: '',
    dealId: '',
    priority: 'normal',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const partnerOptions = [
    { value: 'partner-1', label: 'TechCorp Solutions' },
    { value: 'partner-2', label: 'GlobalTech Partners' },
    { value: 'partner-3', label: 'Enterprise Systems Inc' },
    { value: 'partner-4', label: 'Digital Solutions Group' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.partner) newErrors.partner = 'Partner selection is required';
    if (!formData?.quantity) newErrors.quantity = 'Quantity is required';
    if (parseInt(formData?.quantity) > product?.available) {
      newErrors.quantity = `Cannot exceed available quantity (${product?.available})`;
    }
    if (parseInt(formData?.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }
    onAllocate({ ...formData, productId: product?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 z-[300] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Allocate Inventory</h2>
            <p className="caption text-muted-foreground mt-1">
              Assign stock to partner or deal
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
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Package" size={24} className="text-primary" />
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
                    Location: <span className="font-medium text-foreground">{product?.location}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              label="Select Partner"
              description="Choose the partner to allocate inventory to"
              required
              options={partnerOptions}
              value={formData?.partner}
              onChange={(value) => handleChange('partner', value)}
              error={errors?.partner}
            />

            <Input
              label="Quantity"
              type="number"
              placeholder="Enter quantity to allocate"
              description={`Maximum available: ${product?.available} units`}
              required
              value={formData?.quantity}
              onChange={(e) => handleChange('quantity', e?.target?.value)}
              error={errors?.quantity}
              min="1"
              max={product?.available}
            />

            <Input
              label="Deal ID (Optional)"
              type="text"
              placeholder="Enter associated deal ID"
              description="Link this allocation to a specific deal"
              value={formData?.dealId}
              onChange={(e) => handleChange('dealId', e?.target?.value)}
            />

            <Select
              label="Priority Level"
              description="Set allocation priority for processing"
              options={priorityOptions}
              value={formData?.priority}
              onChange={(value) => handleChange('priority', value)}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Add any additional notes or special instructions..."
                value={formData?.notes}
                onChange={(e) => handleChange('notes', e?.target?.value)}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
              />
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
              iconName="Check"
              iconPosition="left"
            >
              Allocate Inventory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocationModal;