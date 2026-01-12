import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddDealModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    stage: 'prospecting',
    partner: '',
    probability: '50',
    closeDate: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const stageOptions = [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' }
  ];

  const partnerOptions = [
    { value: 'techcorp', label: 'TechCorp Solutions' },
    { value: 'globaltech', label: 'GlobalTech Partners' },
    { value: 'innovate', label: 'Innovate Systems' },
    { value: 'digital', label: 'Digital Dynamics' },
    { value: 'enterprise', label: 'Enterprise Networks' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Opportunity name is required';
    }

    if (!formData?.company?.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData?.value || parseFloat(formData?.value) <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }

    if (!formData?.partner) {
      newErrors.partner = 'Partner selection is required';
    }

    if (!formData?.closeDate) {
      newErrors.closeDate = 'Expected close date is required';
    } else {
      const selectedDate = new Date(formData.closeDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.closeDate = 'Close date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const newDeal = {
        id: Date.now(),
        ...formData,
        value: parseFloat(formData?.value),
        probability: parseInt(formData?.probability),
        createdAt: new Date()?.toISOString()
      };
      
      onAdd(newDeal);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={20} className="text-primary" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Add New Deal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Opportunity Name"
                type="text"
                placeholder="Enter opportunity name"
                value={formData?.name}
                onChange={(e) => handleChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />

              <Input
                label="Company Name"
                type="text"
                placeholder="Enter company name"
                value={formData?.company}
                onChange={(e) => handleChange('company', e?.target?.value)}
                error={errors?.company}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Deal Value ($)"
                type="number"
                placeholder="0"
                value={formData?.value}
                onChange={(e) => handleChange('value', e?.target?.value)}
                error={errors?.value}
                min="0"
                step="0.01"
                required
              />

              <Select
                label="Deal Stage"
                options={stageOptions}
                value={formData?.stage}
                onChange={(value) => handleChange('stage', value)}
                required
              />
            </div>

            <Select
              label="Assigned Partner"
              options={partnerOptions}
              value={formData?.partner}
              onChange={(value) => handleChange('partner', value)}
              error={errors?.partner}
              placeholder="Select a partner"
              searchable
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Probability (%)"
                  type="number"
                  placeholder="50"
                  value={formData?.probability}
                  onChange={(e) => handleChange('probability', e?.target?.value)}
                  min="0"
                  max="100"
                  required
                />
                <div className="mt-2 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${formData?.probability}%` }}
                  />
                </div>
              </div>

              <Input
                label="Expected Close Date"
                type="date"
                value={formData?.closeDate}
                onChange={(e) => handleChange('closeDate', e?.target?.value)}
                error={errors?.closeDate}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description <span className="text-muted-foreground">(Optional)</span>
              </label>
              <textarea
                value={formData?.description}
                onChange={(e) => handleChange('description', e?.target?.value)}
                placeholder="Enter deal description, notes, or additional details..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
              />
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground mb-1">
                    Deal Registration
                  </div>
                  <div className="caption text-muted-foreground">
                    This deal will be automatically registered and protected for the assigned partner. Compliance tracking will be initiated upon creation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="border-t border-border p-4 md:p-6 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth
            className="sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={handleSubmit}
            fullWidth
            className="sm:w-auto"
          >
            Create Deal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddDealModal;