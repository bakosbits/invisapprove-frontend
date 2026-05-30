import {
  Bell,
  CheckSquare,
  LayoutDashboard,
  Link2,
  Settings,
  Zap,
} from "lucide-react";
import { Avatar } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { NavItem } from "./nav-item";
import { useAuth } from "../../hooks/use-auth";
import logo from "../../assets/invisapprove-logo-light.png";


const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/approvals", icon: CheckSquare, label: "Approvals" },
  { to: "/rules", icon: Zap, label: "Rules" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/integrations", icon: Link2, label: "Integrations" },
  { to: "/settings", icon: Settings, label: "Settings" },
] as const;

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-invisapprove-border bg-invisapprove-surface">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex h-7 w-10 items-center justify-center">
          <img src={logo} alt="Invisapprove Logo" className="h-7 w-10" />
        </div>
        <span className="font-semibold text-slate-100 tracking-tight">Invisapprove</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-invisapprove-border p-3">
        <Separator className="mb-3" />
        <div className="flex items-center gap-2.5 rounded-card px-2 py-2">
          <Avatar src={user?.avatar_url} name={user?.name || user?.email} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-slate-200">{user?.name || "User"}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
