import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { initialized, user } = useAuthStore();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
