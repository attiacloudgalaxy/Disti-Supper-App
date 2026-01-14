import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import ProgressStepper from './components/ProgressStepper';
import RegistrationForm from './components/RegistrationForm';
import SuccessMessage from './components/SuccessMessage';
import { submitRegistration } from '../../services/registrationService';

const DistributorRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [submittedData, setSubmittedData] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const steps = [
        { id: 1, label: 'Company' },
        { id: 2, label: 'Contact' },
        { id: 3, label: 'Location' }
    ];

    const handleSubmit = async (formData, recaptchaToken) => {
        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            const result = await submitRegistration(formData, recaptchaToken);

            if (result.success) {
                setSubmittedData(formData);
                setIsSuccess(true);
            } else {
                setSubmissionError(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterAnother = () => {
        setIsSuccess(false);
        setSubmittedData(null);
        setCurrentStep(1);
    };

    return (
        <>
            <Helmet>
                <title>Partner Registration | DistributorHub</title>
                <meta name="description" content="Register as a distribution partner with DistributorHub. Join our network and start growing your business today." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                {/* Header */}
                <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                        <a href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Icon name="Package" size={24} className="text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground">DistributorHub</span>
                        </a>
                        <a
                            href="/login"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                        >
                            Already registered?
                            <span className="text-primary font-medium">Sign In</span>
                        </a>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-2xl mx-auto px-4 py-12">
                    {!isSuccess ? (
                        <>
                            {/* Page Title */}
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    Become a Partner
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                                    Join our distribution network and unlock exclusive benefits, competitive pricing, and dedicated support.
                                </p>
                            </div>

                            {/* Progress Stepper */}
                            <ProgressStepper currentStep={currentStep} steps={steps} />

                            {/* Form Card */}
                            <div className="bg-card border border-border rounded-2xl shadow-elevation-lg p-6 md:p-8">
                                {/* Error Message */}
                                {submissionError && (
                                    <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20">
                                        <div className="flex items-start gap-3">
                                            <Icon name="AlertCircle" size={20} className="text-danger flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-danger">Registration Failed</p>
                                                <p className="text-sm text-muted-foreground mt-1">{submissionError}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <RegistrationForm
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                    onStepChange={setCurrentStep}
                                />
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Icon name="Shield" size={18} className="text-success" />
                                    <span>Secure & Encrypted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="Clock" size={18} className="text-primary" />
                                    <span>Quick Approval</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="Headphones" size={18} className="text-accent" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-card border border-border rounded-2xl shadow-elevation-lg">
                            <SuccessMessage
                                partnerData={submittedData}
                                onRegisterAnother={handleRegisterAnother}
                            />
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="w-full border-t border-border/50 bg-background/80 backdrop-blur-sm mt-auto">
                    <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} DistributorHub. All rights reserved.</p>
                        <div className="mt-2 flex items-center justify-center gap-4">
                            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                            <span>•</span>
                            <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default DistributorRegistration;
