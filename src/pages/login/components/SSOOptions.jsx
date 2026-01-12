import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SSOOptions = () => {
  const ssoProviders = [
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: 'Building2',
      color: '#0078D4'
    },
    {
      id: 'google',
      name: 'Google',
      icon: 'Mail',
      color: '#4285F4'
    }
  ];

  const handleSSOLogin = (provider) => {
    // TODO: Implement - console.log(`SSO login with ${provider?.name}`);
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {ssoProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            size="default"
            onClick={() => handleSSOLogin(provider)}
            className="w-full"
          >
            <Icon name={provider?.icon} size={20} className="mr-2" />
            {provider?.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SSOOptions;