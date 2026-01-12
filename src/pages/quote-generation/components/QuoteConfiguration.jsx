import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const QuoteConfiguration = ({ onApplyConfiguration, currentDiscount }) => {
  const [discount, setDiscount] = useState(currentDiscount || 0);
  const [paymentTerms, setPaymentTerms] = useState('net-30');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [includeWarranty, setIncludeWarranty] = useState(true);
  const [includeSupport, setIncludeSupport] = useState(false);
  const [validityDays, setValidityDays] = useState('30');

  const paymentTermsOptions = [
    { value: 'net-30', label: 'Net 30 Days' },
    { value: 'net-60', label: 'Net 60 Days' },
    { value: 'net-90', label: 'Net 90 Days' },
    { value: 'immediate', label: 'Immediate Payment' },
    { value: 'cod', label: 'Cash on Delivery' }
  ];

  const deliveryOptions = [
    { value: 'standard', label: 'Standard Shipping (5-7 days)' },
    { value: 'express', label: 'Express Shipping (2-3 days)' },
    { value: 'overnight', label: 'Overnight Delivery' },
    { value: 'pickup', label: 'Customer Pickup' }
  ];

  const validityOptions = [
    { value: '15', label: '15 Days' },
    { value: '30', label: '30 Days' },
    { value: '45', label: '45 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' }
  ];

  const handleApply = () => {
    onApplyConfiguration({
      discount: parseFloat(discount),
      paymentTerms,
      deliveryMethod,
      includeWarranty,
      includeSupport,
      validityDays: parseInt(validityDays)
    });
  };

  const requiresApproval = discount > 15;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-sm">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Quote Configuration</h2>
          {requiresApproval && (
            <span className="caption px-3 py-1 bg-warning/10 text-warning rounded-full flex items-center space-x-1">
              <Icon name="AlertTriangle" size={14} />
              <span>Approval Required</span>
            </span>
          )}
        </div>
      </div>
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <Input
              type="number"
              label="Discount Percentage"
              description="Maximum 25% without approval"
              value={discount}
              onChange={(e) => setDiscount(e?.target?.value)}
              min="0"
              max="100"
              placeholder="0"
            />
            {requiresApproval && (
              <p className="caption text-warning mt-2 flex items-center space-x-1">
                <Icon name="Info" size={14} />
                <span>Discounts &gt; 15% require manager approval</span>
              </p>
            )}
          </div>

          <Select
            label="Quote Validity"
            description="How long this quote remains valid"
            options={validityOptions}
            value={validityDays}
            onChange={setValidityDays}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Select
            label="Payment Terms"
            description="Customer payment conditions"
            options={paymentTermsOptions}
            value={paymentTerms}
            onChange={setPaymentTerms}
          />

          <Select
            label="Delivery Method"
            description="Shipping and delivery options"
            options={deliveryOptions}
            value={deliveryMethod}
            onChange={setDeliveryMethod}
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground mb-3">Additional Services</h3>
          
          <Checkbox
            label="Include Standard Warranty"
            description="1-year manufacturer warranty coverage"
            checked={includeWarranty}
            onChange={(e) => setIncludeWarranty(e?.target?.checked)}
          />

          <Checkbox
            label="Include Technical Support"
            description="90-day technical support package (+$299)"
            checked={includeSupport}
            onChange={(e) => setIncludeSupport(e?.target?.checked)}
          />
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Pricing Intelligence</h4>
              <p className="caption text-muted-foreground">
                Based on market analysis, your current configuration is competitive. Consider bundling support services for improved margin.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="Settings"
          iconPosition="left"
          onClick={handleApply}
        >
          Apply Configuration
        </Button>
      </div>
    </div>
  );
};

export default QuoteConfiguration;