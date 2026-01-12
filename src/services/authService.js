import { supabase } from '../lib/supabase';
import { logAuthEvent, AuditEventType } from './auditService';

export const authService = {
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Log failure
        await logAuthEvent(AuditEventType.AUTH_LOGIN_FAILURE, email, false, { error: error.message });
        throw error;
      };

      // Log success
      await logAuthEvent(AuditEventType.AUTH_LOGIN_SUCCESS, email, true);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signUp(email, password, fullName, role = 'staff') {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signOut() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const email = user?.email;

      const { error } = await supabase?.auth?.signOut();
      if (error) throw error;

      // Log logout
      if (email) {
        await logAuthEvent(AuditEventType.AUTH_LOGOUT, email, true);
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }
};