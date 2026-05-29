import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, actions }: TopbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-invisapprove-border bg-invisapprove-surface px-6">
      <h1 className="text-sm font-semibold text-slate-200">{title}</h1>

      <div className="flex items-center gap-3">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-invisapprove-primary focus:ring-offset-2 focus:ring-offset-invisapprove-bg">
              <Avatar src={user?.avatar_url} name={user?.name || user?.email} size="sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem disabled className="text-xs text-slate-500">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void handleSignOut()}>
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
