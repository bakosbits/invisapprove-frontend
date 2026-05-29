import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface PageShellProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({ title, actions, children }: PageShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-invisapprove-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} actions={actions} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
