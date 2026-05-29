import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { Skeleton } from "../ui/skeleton";

export function ProtectedRoute() {
  const { isAuthenticated, initialized } = useAuth();

  if (!initialized) {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
