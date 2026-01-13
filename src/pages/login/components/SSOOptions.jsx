import React, { useState, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { loginRequest, isMsalConfigured } from '../../../lib/msalConfig';

const SSOOptions = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  // Check if MSAL is configured
  const msalConfigured = isMsalConfigured();

  // Only call useMsal hook if Azure AD is configured
  // The hook is safe to call unconditionally since App.jsx wraps with MsalProvider when configured
  let instance = null;
  try {
    if (msalConfigured) {
      const msal = useMsal();
      instance = msal.instance;
    }
  } catch (e) {
    // MsalProvider not available - this is expected when Azure AD is not configured
  }

  const handleMicrosoftLogin = useCallback(async () => {
    setLoading('microsoft');
    setError(null);

    if (!msalConfigured) {
      setError('Microsoft login is not configured. Please contact administrator.');
      setLoading(null);
      return;
    }

    if (!instance) {
      setError('Microsoft authentication service is not available.');
      setLoading(null);
      return;
    }

    try {
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error('Microsoft login error:', err);
      setError(err.message || 'Microsoft login failed. Please try again.');
      setLoading(null);
    }
  }, [instance, msalConfigured]);

  const handleGoogleLogin = useCallback(async () => {
    setLoading('google');
    setError(null);

    const { error: authError } = await signInWithGoogle();

    if (authError) {
      setError(authError.message || 'Google login failed. Please try again.');
      setLoading(null);
    }
  }, [signInWithGoogle]);

  const ssoProviders = [
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: 'Building2',
      handler: handleMicrosoftLogin
    },
    {
      id: 'google',
      name: 'Google',
      icon: 'Mail',
      handler: handleGoogleLogin
    }
  ];

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
            onClick={provider.handler}
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