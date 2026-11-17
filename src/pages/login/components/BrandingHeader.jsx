import React from 'react';
import logo from '../../../assets/logo.png';

const BrandingHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <img
          src={logo}
          alt="Ultimate Distribution Company"
          className="w-auto h-24 object-contain"
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
        Welcome to DistributorHub
      </h1>
      <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
        Unified platform for distributor operations and partner enablement
      </p>
    </div>
  );
};

export default BrandingHeader;
