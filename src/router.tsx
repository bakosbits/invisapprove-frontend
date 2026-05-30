import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/protected-route";
import { AuthCallbackPage } from "./pages/auth-callback";
import { DashboardPage } from "./pages/dashboard";
import { LoginPage } from "./pages/login";
import { ApprovalsPage } from "./pages/approvals";
import { ApprovalDetailPage } from "./pages/approvals/detail";
import { RulesPage } from "./pages/rules";
import { RuleDetailPage } from "./pages/rules/detail";
import { NotificationsPage } from "./pages/notifications";
import { IntegrationsPage } from "./pages/integrations";
import { SettingsPage } from "./pages/settings";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/approvals/:id" element={<ApprovalDetailPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/rules/:id" element={<RuleDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
