import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const SSOOptions = () => {
  const { signInWithAzure, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const ssoProviders = [
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: 'Building2',
      color: '#0078D4',
      handler: signInWithAzure
    },
    {
      id: 'google',
      name: 'Google',
      icon: 'Mail',
      color: '#4285F4',
      handler: signInWithGoogle
    }
  ];

  const handleSSOLogin = async (provider) => {
    setLoading(provider.id);
    setError(null);

    const { error: authError } = await provider.handler();

    if (authError) {
      setError(authError.message || `${provider.name} login failed. Please try again.`);
      setLoading(null);
    }
    // On success, the OAuth flow will redirect the user
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

      {error && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="caption text-error">{error}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {ssoProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            size="default"
            onClick={() => handleSSOLogin(provider)}
            className="w-full"
            disabled={loading !== null}
          >
            {loading === provider.id ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Icon name={provider?.icon} size={20} className="mr-2" />
                {provider?.name}
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SSOOptions;