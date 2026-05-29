import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "../../hooks/use-auth";

export function AuthCallbackPage() {
  const { isAuthenticated, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;
    void navigate(isAuthenticated ? "/dashboard" : "/login", { replace: true });
  }, [initialized, isAuthenticated, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-invisapprove-bg">
      <div className="space-y-3 w-64">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
