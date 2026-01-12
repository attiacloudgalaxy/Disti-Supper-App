import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import BrandingHeader from './components/BrandingHeader';
import LoginForm from './components/LoginForm';
import SSOOptions from './components/SSOOptions';
import RoleIndicator from './components/RoleIndicator';
import SecurityBadges from './components/SecurityBadges';

const Login = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'var(--color-background)';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Login - DistributorHub</title>
        <meta name="description" content="Sign in to DistributorHub - Unified platform for distributor operations and partner enablement" />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Branding & Information */}
            <div className="hidden lg:block">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="22.08" x2="12" y2="12" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      DistributorHub
                    </h2>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                    Streamline Your Distribution Operations
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Comprehensive platform for deal management, partner enablement, and real-time analytics. Built for distributor success.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: 'BarChart3',
                      title: 'Real-Time Analytics',
                      description: 'Track KPIs and performance metrics across your entire distribution network'
                    },
                    {
                      icon: 'Users',
                      title: 'Partner Enablement',
                      description: 'Empower partners with self-service tools and comprehensive training resources'
                    },
                    {
                      icon: 'Shield',
                      title: 'Compliance Tracking',
                      description: 'Maintain audit trails and ensure regulatory compliance automatically'
                    }
                  ]?.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {feature?.icon === 'BarChart3' && (
                            <path d="M3 3v18h18M18 17V9m-5 8V5m-5 12v-4" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          )}
                          {feature?.icon === 'Users' && (
                            <>
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="9" cy="7" r="4" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </>
                          )}
                          {feature?.icon === 'Shield' && (
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          )}
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-foreground mb-1">
                          {feature?.title}
                        </h4>
                        <p className="caption text-muted-foreground">
                          {feature?.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full">
              <div className="bg-card border border-border rounded-2xl shadow-elevation-lg p-6 md:p-8 lg:p-10">
                <BrandingHeader />
                <LoginForm />
                <SSOOptions />
                <RoleIndicator />
                <SecurityBadges />
              </div>

              <p className="caption text-muted-foreground text-center mt-6">
                © {new Date()?.getFullYear()} DistributorHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;