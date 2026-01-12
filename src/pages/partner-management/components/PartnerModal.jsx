import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PartnerModal = ({ partner, onClose, onSubmit }) => {
    const isEditing = !!partner;

    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        tier: '',
        region: '',
        territory: '',
        address: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (partner) {
            setFormData({
                companyName: partner.companyName || '',
                contactName: partner.contactName || '',
                email: partner.email || '',
                phone: partner.phone || '',
                website: partner.website || '',
                tier: partner.tier || '',
                region: partner.region || '',
                territory: partner.territory || '',
                address: partner.address || ''
            });
        }
    }, [partner]);

    const tierOptions = [
        { value: 'platinum', label: 'Platinum' },
        { value: 'gold', label: 'Gold' },
        { value: 'silver', label: 'Silver' },
        { value: 'bronze', label: 'Bronze' }
    ];

    const regionOptions = [
        { value: 'north-america', label: 'North America' },
        { value: 'europe', label: 'Europe' },
        { value: 'asia-pacific', label: 'Asia Pacific' },
        { value: 'latin-america', label: 'Latin America' }
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors?.[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData?.companyName?.trim()) newErrors.companyName = 'Company name is required';
        if (!formData?.contactName?.trim()) newErrors.contactName = 'Contact name is required';
        if (!formData?.email?.trim()) newErrors.email = 'Email is required';
        if (!formData?.phone?.trim()) newErrors.phone = 'Phone is required';
        if (!formData?.tier) newErrors.tier = 'Tier selection is required';
        if (!formData?.region) newErrors.region = 'Region selection is required';

        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEditing ? 'bg-accent/10' : 'bg-primary/10'}`}>
                            <Icon name={isEditing ? 'Edit' : 'UserPlus'} size={20} className={isEditing ? 'text-accent' : 'text-primary'} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                            {isEditing ? 'Edit Partner' : 'Add New Partner'}
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={onClose}
                    />
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Company Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Company Name"
                                    type="text"
                                    placeholder="Enter company name"
                                    value={formData?.companyName}
                                    onChange={(e) => handleChange('companyName', e?.target?.value)}
                                    error={errors?.companyName}
                                    required
                                />
                                <Input
                                    label="Website"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={formData?.website}
                                    onChange={(e) => handleChange('website', e?.target?.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Contact Name"
                                    type="text"
                                    placeholder="Enter contact name"
                                    value={formData?.contactName}
                                    onChange={(e) => handleChange('contactName', e?.target?.value)}
                                    error={errors?.contactName}
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="contact@example.com"
                                    value={formData?.email}
                                    onChange={(e) => handleChange('email', e?.target?.value)}
                                    error={errors?.email}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData?.phone}
                                    onChange={(e) => handleChange('phone', e?.target?.value)}
                                    error={errors?.phone}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Partner Classification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Partner Tier"
                                    options={tierOptions}
                                    value={formData?.tier}
                                    onChange={(value) => handleChange('tier', value)}
                                    placeholder="Select tier"
                                    error={errors?.tier}
                                    required
                                />
                                <Select
                                    label="Region"
                                    options={regionOptions}
                                    value={formData?.region}
                                    onChange={(value) => handleChange('region', value)}
                                    placeholder="Select region"
                                    error={errors?.region}
                                    required
                                />
                                <Input
                                    label="Territory"
                                    type="text"
                                    placeholder="Enter territory"
                                    value={formData?.territory}
                                    onChange={(e) => handleChange('territory', e?.target?.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Address</h3>
                            <Input
                                label="Business Address"
                                type="text"
                                placeholder="Enter complete address"
                                value={formData?.address}
                                onChange={(e) => handleChange('address', e?.target?.value)}
                            />
                        </div>
                    </div>
                </form>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" iconName={isEditing ? 'Save' : 'Check'} onClick={handleSubmit}>
                        {isEditing ? 'Save Changes' : 'Add Partner'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PartnerModal;
