import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Isolated async operations - never called from auth callbacks
  const profileOperations = {
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      try {
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
        if (!error) setUserProfile(data)
      } catch (error) {
        console.error('Profile load error:', error)
      } finally {
        setProfileLoading(false)
      }
    },

    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  // Auth state handlers - PROTECTED from async modification
  const authStateHandlers = {
    // This handler MUST remain synchronous - Supabase requirement
    onChange: (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        profileOperations?.load(session?.user?.id) // Fire-and-forget
      } else {
        profileOperations?.clear()
      }
    }
  }

  useEffect(() => {
    // Initial session check
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session)
    })

    // CRITICAL: This must remain synchronous
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Auth methods
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({ email, password })
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (!error) {
        setUser(null)
        profileOperations?.clear()
      }
      return { error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }

    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      if (!error) setUserProfile(data)
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  // Get the base path for OAuth redirects (handles GitHub Pages subdirectory)
  const getRedirectUrl = (path = '/executive-dashboard') => {
    // Use import.meta.env.BASE_URL which is set by Vite based on the 'base' config
    const basePath = import.meta.env.BASE_URL || '/'
    return window.location.origin + basePath + path.replace(/^\//, '')
  }

  // Azure AD (Entra ID) direct authentication using MSAL
  const signInWithAzure = async () => {
    try {
      // Dynamically import MSAL to avoid issues if not configured
      const { msalInstance, loginRequest, isMsalConfigured } = await import('../lib/msalConfig')

      if (!isMsalConfigured()) {
        return { error: { message: 'Azure AD is not configured. Please set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID environment variables.' } }
      }

      // Initialize MSAL if needed
      await msalInstance.initialize()

      // Use popup for better UX (avoids page reload issues with redirect on GitHub Pages)
      const response = await msalInstance.loginPopup(loginRequest)

      if (response && response.account) {
        // Get the ID token to use with Supabase
        const tokenResponse = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: response.account
        })

        // Sign in to Supabase using the Azure token
        // This creates/updates the user in Supabase with Azure profile info
        const { data, error } = await supabase?.auth?.signInWithIdToken({
          provider: 'azure',
          token: tokenResponse.idToken,
          nonce: '' // Azure doesn't require nonce for ID tokens
        })

        if (error) {
          // If Supabase integration fails, still allow the user in with basic session
          console.warn('Supabase token sync failed, using MSAL session:', error)
          // Set a basic user object from Azure token
          setUser({
            id: response.account.localAccountId,
            email: response.account.username,
            user_metadata: {
              full_name: response.account.name,
              email: response.account.username,
              provider: 'azure'
            }
          })
          return { data: response, error: null }
        }

        return { data, error: null }
      }

      return { error: { message: 'Azure login was cancelled or failed.' } }
    } catch (error) {
      console.error('Azure login error:', error)
      // Handle user cancelled popup
      if (error.errorCode === 'user_cancelled') {
        return { error: { message: 'Login cancelled by user.' } }
      }
      return { error: { message: error.message || 'Azure login failed. Please try again.' } }
    }
  }

  // Google OAuth sign-in (still uses Supabase OAuth)
  const signInWithGoogle = async () => {
    try {
      const redirectUrl = getRedirectUrl()
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      })
      return { data, error }
    } catch (error) {
      return { error: { message: 'Google login failed. Please try again.' } }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signOut,
    updateProfile,
    signInWithAzure,
    signInWithGoogle,
    isAuthenticated: !!user
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
