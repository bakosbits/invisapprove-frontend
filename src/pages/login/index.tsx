import { Zap } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function LoginPage() {
  const { isAuthenticated, loading, signInWithMagicLink, signInWithSlack } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    try {
      await signInWithMagicLink(email.trim());
      setSent(true);
    } catch {
      setError("Failed to send magic link. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-invisapprove-bg px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-invisapprove-primary/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-invisapprove-primary shadow-[0_0_24px_rgba(91,79,217,0.5)]">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">invisapprove</h1>
            <p className="mt-1 text-sm text-slate-500">Friction-free approvals</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-modal border border-invisapprove-border bg-invisapprove-surface p-6 shadow-modal">
          {sent ? (
            <div className="text-center">
              <div className="mb-3 text-2xl">📬</div>
              <p className="text-sm font-medium text-slate-200">Check your email</p>
              <p className="mt-1 text-xs text-slate-500">
                We sent a magic link to <span className="text-slate-300">{email}</span>
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-xs text-invisapprove-primary hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Sign in</h2>
                <p className="mt-0.5 text-xs text-slate-500">No password required</p>
              </div>

              {/* Slack OAuth */}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => void signInWithSlack()}
                disabled={loading}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                </svg>
                Continue with Slack
              </Button>

              <div className="relative flex items-center gap-3">
                <div className="h-px flex-1 bg-invisapprove-border" />
                <span className="text-[11px] text-slate-600">or</span>
                <div className="h-px flex-1 bg-invisapprove-border" />
              </div>

              <form onSubmit={(e) => void handleMagicLink(e)} className="space-y-3">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  disabled={loading}
                />
                <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
                  {loading ? "Sending…" : "Send magic link"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
