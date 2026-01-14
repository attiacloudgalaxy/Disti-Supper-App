import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessMessage = ({ partnerData, onRegisterAnother }) => {
    return (
        <div className="text-center py-12 px-6">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={48} className="text-success" />
            </div>

            {/* Success Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Registration Submitted Successfully!
            </h2>

            {/* Success Description */}
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Thank you for registering with DistributorHub. Your application is now under review.
                Our team will contact you within 2-3 business days.
            </p>

            {/* Partner Details Card */}
            <div className="bg-muted/50 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Registration Details
                </h3>
                <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Company:</span>
                        <span className="font-medium text-foreground">{partnerData?.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="font-medium text-foreground">{partnerData?.contactName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-foreground">{partnerData?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                            Pending Review
                        </span>
                    </div>
                </div>
            </div>

            {/* What's Next */}
            <div className="bg-primary/5 rounded-xl p-6 max-w-md mx-auto mb-8">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                    What Happens Next?
                </h3>
                <div className="space-y-3 text-left text-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">1</span>
                        </div>
                        <p className="text-muted-foreground">Our team reviews your application</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">2</span>
                        </div>
                        <p className="text-muted-foreground">You'll receive an email confirmation</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">3</span>
                        </div>
                        <p className="text-muted-foreground">Access your partner portal once approved</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                    variant="outline"
                    iconName="ArrowLeft"
                    onClick={onRegisterAnother}
                >
                    Register Another
                </Button>
                <a
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Icon name="LogIn" size={18} />
                    Go to Login
                </a>
            </div>
        </div>
    );
};

export default SuccessMessage;
