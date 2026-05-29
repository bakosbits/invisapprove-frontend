import { createClient } from "@supabase/supabase-js";
import { create } from "zustand";
import { setTokenGetter } from "../api/client";
import type { User } from "../api/types";

const supabase = createClient(
  import.meta.env["VITE_SUPABASE_URL"] as string,
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string
);

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithSlack: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,

  signInWithMagicLink: async (email) => {
    set({ loading: true });
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    set({ loading: false });
  },

  signInWithSlack: async () => {
    set({ loading: true });
    await supabase.auth.signInWithOAuth({
      provider: "slack_oidc",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, token: null });
  },

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const user: User = {
        id: session.user.id,
        email: session.user.email ?? "",
        name: (session.user.user_metadata?.["name"] as string | undefined) ?? "",
        avatar_url: (session.user.user_metadata?.["avatar_url"] as string | undefined) ?? null,
      };
      set({ user, token: session.access_token, initialized: true });
    } else {
      set({ initialized: true });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email ?? "",
            name: (session.user.user_metadata?.["name"] as string | undefined) ?? "",
            avatar_url: (session.user.user_metadata?.["avatar_url"] as string | undefined) ?? null,
          },
          token: session.access_token,
        });
      } else {
        set({ user: null, token: null });
      }
    });
  },
}));

// Wire token getter into API client — runs once on module load
setTokenGetter(() => useAuthStore.getState().token);
