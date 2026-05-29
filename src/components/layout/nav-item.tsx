import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
}

export function NavItem({ to, icon: Icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-card px-3 py-2 text-sm font-medium transition-all duration-150 group",
          isActive
            ? "bg-invisapprove-primary-subtle text-indigo-300"
            : "text-slate-400 hover:bg-invisapprove-surface-raised hover:text-slate-200"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")}
          />
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
}
