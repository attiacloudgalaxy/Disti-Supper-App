import React, { useState, useEffect } from 'react';
import Button from './ui/Button';

// Cookie names
const CONSENT_COOKIE = 'distributorhub_cookie_consent';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem(CONSENT_COOKIE);
        if (!hasConsented) {
            setShowConsent(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_COOKIE, 'true');
        setShowConsent(false);
    };

    const handleDecline = () => {
        // Setup minimal cookies logic here if needed
        localStorage.setItem(CONSENT_COOKIE, 'false');
        setShowConsent(false);
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-fade-in-up">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">We value your privacy</h3>
                    <p className="text-sm text-muted-foreground">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
                        By clicking "Accept All", you consent to our use of cookies.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleDecline}>
                        Reject All
                    </Button>
                    <Button variant="default" size="sm" onClick={handleAccept}>
                        Accept All
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
