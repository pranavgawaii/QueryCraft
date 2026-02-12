import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/utils/supabaseClient";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  loginAsDemo: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

let authSubscriptionBound = false;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    if (authSubscriptionBound) {
      set({ initialized: true });
      return;
    }

    set({ loading: true });

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      set({ loading: false, initialized: true, user: null, session: null });
      return;
    }

    set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
      initialized: true,
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      });
    });

    authSubscriptionBound = true;

    // Clean-up is intentionally omitted because the app lifecycle is singleton.
    void subscription;
  },

  login: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });

    if (error) {
      return { error: error.message };
    }

    return {};
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const redirectTo = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    set({ loading: false });

    if (error) {
      return { error: error.message };
    }

    return {};
  },

  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  },

  loginAsDemo: async () => {
    // Mock user and session for demo purposes
    const demoUser = {
      id: "demo-user-id",
      app_metadata: { provider: "email" },
      user_metadata: { full_name: "Demo User" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: "demo@querycraft.app",
      phone: "",
      role: "authenticated",
      updated_at: new Date().toISOString(),
    } as unknown as User;

    const demoSession = {
      access_token: "demo-access-token",
      refresh_token: "demo-refresh-token",
      expires_in: 3600,
      token_type: "bearer",
      user: demoUser,
    } as unknown as Session;

    set({
      user: demoUser,
      session: demoSession,
      loading: false,
    });
  },

  sendPasswordReset: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: error.message };
    }

    return {};
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
