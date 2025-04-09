import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import InviteAdmin from "@/pages/Auth/InviteAdmin";
import InvoicesPage from "@/pages/Invoices/InvoicesPage";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import OrdersPage from "@/pages/Orders/OrdersPage";
import AnalyticsPage from "@/pages/Analytics/AnalyticsPage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import ProfilePage from "@/pages/Profile/ProfilePage";

import AdminLayout from "@/layouts/AdminLayout";

const RequireAuth = ({ children, role }) => {
  const { admin, authLoading } = useAuth();

  if (authLoading) return <div className="text-center mt-20">Loading...</div>;
  if (!admin) return <Navigate to="/login" replace />;
  if (role && admin.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/invite"
        element={
          <RequireAuth role="superadmin">
            <InviteAdmin />
          </RequireAuth>
        }
      />

      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
