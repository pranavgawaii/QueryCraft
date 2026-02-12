import { useEffect } from "react";
import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { ToastViewport } from "@/components/ui/Toast";
import { ConnectionEdit } from "@/pages/ConnectionEdit";
import { ConnectionNew } from "@/pages/ConnectionNew";
import { Connections } from "@/pages/Connections";
import { Dashboard } from "@/pages/Dashboard";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { QueryBuilder } from "@/pages/QueryBuilder";
import { ResetPassword } from "@/pages/ResetPassword";
import { SavedQueries } from "@/pages/SavedQueries";
import { Settings } from "@/pages/Settings";
import { SignUp } from "@/pages/SignUp";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";

const ProtectedLayout = ({ children }: { children: ReactElement }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

export const App = () => {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeSettings = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    void initializeAuth();
    initializeSettings();
  }, [initializeAuth, initializeSettings]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/connections"
          element={
            <ProtectedLayout>
              <Connections />
            </ProtectedLayout>
          }
        />

        <Route
          path="/connections/new"
          element={
            <ProtectedLayout>
              <ConnectionNew />
            </ProtectedLayout>
          }
        />

        <Route
          path="/connections/:id/edit"
          element={
            <ProtectedLayout>
              <ConnectionEdit />
            </ProtectedLayout>
          }
        />

        <Route
          path="/query-builder"
          element={
            <ProtectedLayout>
              <QueryBuilder />
            </ProtectedLayout>
          }
        />

        <Route
          path="/saved-queries"
          element={
            <ProtectedLayout>
              <SavedQueries />
            </ProtectedLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastViewport />
    </>
  );
};
