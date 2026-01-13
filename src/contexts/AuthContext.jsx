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

  // Azure AD (Entra ID) OAuth sign-in
  const signInWithAzure = async () => {
    try {
      const redirectUrl = getRedirectUrl()
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile openid',
          redirectTo: redirectUrl
        }
      })
      return { data, error }
    } catch (error) {
      return { error: { message: 'Azure login failed. Please try again.' } }
    }
  }

  // Google OAuth sign-in
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
