import { useAuthStore } from "../stores/auth.store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const initialized = useAuthStore((s) => s.initialized);
  const signInWithMagicLink = useAuthStore((s) => s.signInWithMagicLink);
  const signInWithSlack = useAuthStore((s) => s.signInWithSlack);
  const signOut = useAuthStore((s) => s.signOut);

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated: !!user,
    signInWithMagicLink,
    signInWithSlack,
    signOut,
  };
}
