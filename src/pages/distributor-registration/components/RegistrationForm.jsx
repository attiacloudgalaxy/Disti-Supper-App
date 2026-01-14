import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { checkDuplicatePartner, isRecaptchaEnabled, getRecaptchaSiteKey } from '../../../services/registrationService';

const RegistrationForm = ({ onSubmit, isSubmitting }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        region: '',
        territory: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [duplicateWarning, setDuplicateWarning] = useState(null);
    const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);
    const debounceTimer = useRef(null);

    const regionOptions = [
        { value: 'north-america', label: 'North America' },
        { value: 'europe', label: 'Europe' },
        { value: 'asia-pacific', label: 'Asia Pacific' },
        { value: 'latin-america', label: 'Latin America' },
        { value: 'middle-east', label: 'Middle East & Africa' }
    ];

    // Load reCAPTCHA script
    useEffect(() => {
        if (isRecaptchaEnabled()) {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${getRecaptchaSiteKey()}`;
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    // Debounced duplicate check
    const checkDuplicates = useCallback(async () => {
        if (!formData.email && !formData.companyName && !formData.phone) return;

        setIsCheckingDuplicate(true);
        try {
            const result = await checkDuplicatePartner({
                email: formData.email,
                companyName: formData.companyName,
                phone: formData.phone
            });

            if (result.isDuplicate) {
                setDuplicateWarning(result);
            } else {
                setDuplicateWarning(null);
            }
        } catch (error) {
            console.error('Duplicate check failed:', error);
        } finally {
            setIsCheckingDuplicate(false);
        }
    }, [formData.email, formData.companyName, formData.phone]);

    // Trigger duplicate check with debounce
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (formData.email || formData.companyName || formData.phone) {
                checkDuplicates();
            }
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [formData.email, formData.companyName, formData.phone, checkDuplicates]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.companyName?.trim()) newErrors.companyName = 'Company name is required';
            if (!formData.contactName?.trim()) newErrors.contactName = 'Contact name is required';
        }

        if (step === 2) {
            if (!formData.email?.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
            if (!formData.phone?.trim()) {
                newErrors.phone = 'Phone number is required';
            }
        }

        if (step === 3) {
            if (!formData.region) newErrors.region = 'Region is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const executeRecaptcha = async () => {
        if (isRecaptchaEnabled() && window.grecaptcha) {
            try {
                const token = await window.grecaptcha.execute(getRecaptchaSiteKey(), { action: 'submit' });
                setRecaptchaToken(token);
                return token;
            } catch (error) {
                console.error('reCAPTCHA error:', error);
                return null;
            }
        }
        return 'no-recaptcha';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        if (duplicateWarning?.isDuplicate) {
            setErrors(prev => ({
                ...prev,
                [duplicateWarning.field]: duplicateWarning.message
            }));
            return;
        }

        // Execute reCAPTCHA before submission
        const token = await executeRecaptcha();

        onSubmit(formData, token);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon name="Building2" size={32} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Company Information</h3>
                            <p className="text-muted-foreground mt-2">Tell us about your organization</p>
                        </div>

                        <Input
                            label="Company Name"
                            type="text"
                            placeholder="Enter your company name"
                            value={formData.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                            error={errors.companyName}
                            required
                        />

                        <Input
                            label="Contact Person Name"
                            type="text"
                            placeholder="Enter primary contact name"
                            value={formData.contactName}
                            onChange={(e) => handleChange('contactName', e.target.value)}
                            error={errors.contactName}
                            required
                        />

                        <Input
                            label="Company Website"
                            type="url"
                            placeholder="https://www.example.com"
                            value={formData.website}
                            onChange={(e) => handleChange('website', e.target.value)}
                            error={errors.website}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                                <Icon name="Mail" size={32} className="text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Contact Details</h3>
                            <p className="text-muted-foreground mt-2">How can we reach you?</p>
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="contact@company.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            error={errors.phone}
                            required
                        />

                        {/* Duplicate Warning */}
                        {isCheckingDuplicate && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Checking for existing registrations...
                            </div>
                        )}

                        {duplicateWarning?.isDuplicate && (
                            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                                <div className="flex items-start gap-3">
                                    <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-warning">Duplicate Detected</p>
                                        <p className="text-sm text-muted-foreground mt-1">{duplicateWarning.message}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                                <Icon name="MapPin" size={32} className="text-success" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Location & Territory</h3>
                            <p className="text-muted-foreground mt-2">Where does your business operate?</p>
                        </div>

                        <Select
                            label="Region"
                            options={regionOptions}
                            value={formData.region}
                            onChange={(value) => handleChange('region', value)}
                            placeholder="Select your primary region"
                            error={errors.region}
                            required
                        />

                        <Input
                            label="Territory / Sub-region"
                            type="text"
                            placeholder="e.g., West Coast, UK & Ireland"
                            value={formData.territory}
                            onChange={(e) => handleChange('territory', e.target.value)}
                            error={errors.territory}
                        />

                        <Input
                            label="Business Address"
                            type="text"
                            placeholder="Enter your business address"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            error={errors.address}
                        />

                        {/* Summary Card */}
                        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                                <Icon name="ClipboardCheck" size={18} className="text-primary" />
                                Registration Summary
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Company:</span>
                                <span className="text-foreground font-medium">{formData.companyName}</span>
                                <span className="text-muted-foreground">Contact:</span>
                                <span className="text-foreground">{formData.contactName}</span>
                                <span className="text-muted-foreground">Email:</span>
                                <span className="text-foreground">{formData.email}</span>
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="text-foreground">{formData.phone}</span>
                            </div>
                        </div>

                        {/* reCAPTCHA notice */}
                        {isRecaptchaEnabled() && (
                            <p className="text-xs text-muted-foreground text-center">
                                This site is protected by reCAPTCHA and the Google{' '}
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>{' '}
                                and{' '}
                                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    Terms of Service
                                </a>{' '}
                                apply.
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                {currentStep > 1 ? (
                    <Button
                        type="button"
                        variant="outline"
                        iconName="ArrowLeft"
                        onClick={handleBack}
                        disabled={isSubmitting}
                    >
                        Back
                    </Button>
                ) : (
                    <div />
                )}

                {currentStep < 3 ? (
                    <Button
                        type="button"
                        variant="default"
                        iconName="ArrowRight"
                        iconPosition="right"
                        onClick={handleNext}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        variant="default"
                        iconName={isSubmitting ? 'Loader2' : 'Send'}
                        disabled={isSubmitting || duplicateWarning?.isDuplicate}
                        className={isSubmitting ? 'animate-pulse' : ''}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                )}
            </div>
        </form>
    );
};

export default RegistrationForm;
