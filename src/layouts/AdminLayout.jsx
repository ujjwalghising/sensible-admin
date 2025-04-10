import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart,
  Settings,
  User,
  LogOut,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  const menuItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/users", label: "Users", icon: Users },
    { to: "/orders", label: "Orders", icon: FileText },
    { to: "/invoices", label: "Invoices", icon: Receipt }, // 🧾 Added Invoices!
    { to: "/analytics", label: "Analytics", icon: BarChart },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-65 bg-gray-900 text-white flex flex-col justify-between shadow-lg">
        {/* Logo/Header */}
        <div>
          <div className="text-2xl font-bold p-6 border-b border-gray-800 tracking-tight">
            <Link to="/">Admin Panel</Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-4 space-y-1">
            {menuItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-800 font-semibold text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-2">
            Logged in as <br />
            <span className="text-white">{admin?.email}</span>
          </div>
          <button
  onClick={logout}
  className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-md hover:bg-red-600 bg-red-500 text-white transition"
>
  <LogOut className="w-4 h-4" />
  Logout
</button>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
