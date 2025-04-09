import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Receipt,
  BarChart,
  Settings,
} from "lucide-react";

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? "bg-blue-100 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm p-4 space-y-2">
      <h2 className="text-xl font-bold mb-6 pl-2 text-blue-600">Admin Panel</h2>
      <nav className="space-y-1">
        <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/users" icon={Users} label="Users" />
        <SidebarLink to="/orders" icon={Receipt} label="Orders" />
        <SidebarLink to="/invoices" icon={Receipt} label="Invoices" />
        <SidebarLink to="/analytics" icon={BarChart} label="Analytics" />
        <SidebarLink to="/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
}
