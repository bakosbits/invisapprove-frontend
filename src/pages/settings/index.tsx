import { useState } from "react";
import { Link2, Bell, Users, Shield } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/cn";

type Tab = "integrations" | "notifications" | "team";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
];

function IntegrationsTab() {
  return (
    <div className="space-y-4">
      <IntegrationCard
        name="Slack"
        description="Post approval requests and receive approve/reject actions directly in Slack."
        connected={false}
        docsHref="https://api.slack.com/apps"
      />
      <IntegrationCard
        name="Microsoft Teams"
        description="Send Adaptive Card approval requests to Teams channels."
        connected={false}
        docsHref="https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook"
      />
    </div>
  );
}

function IntegrationCard({
  name,
  description,
  connected,
  docsHref,
}: {
  name: string;
  description: string;
  connected: boolean;
  docsHref: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-slate-200 text-sm">{name}</p>
            {connected ? (
              <Badge variant="approved" dot>Connected</Badge>
            ) : (
              <Badge variant="default" dot={false}>Not connected</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a href={docsHref} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">Docs</Button>
          </a>
          <Button variant={connected ? "destructive" : "outline"} size="sm">
            {connected ? "Disconnect" : "Configure"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification channels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">Slack channel</p>
          <p className="text-sm text-slate-300 font-mono">#approvals</p>
          <p className="text-xs text-slate-500 mt-1">
            Set via <code className="bg-invisapprove-muted px-1 rounded text-[11px]">SLACK_CHANNEL</code> in Worker secrets.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">Events</p>
          <ul className="space-y-1 text-xs text-slate-400">
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Approval requested</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Approval completed</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Escalation required</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamTab() {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-3 py-8 justify-center text-center">
          <div>
            <Shield className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Team management coming soon.</p>
            <p className="text-xs text-slate-600 mt-1">
              User roles and permissions will be configured here.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("integrations");

  return (
    <PageShell title="Settings">
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Tab nav */}
        <div className="flex gap-1 border-b border-invisapprove-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === id
                  ? "border-invisapprove-primary text-slate-200"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "integrations" && <IntegrationsTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "team" && <TeamTab />}
      </div>
    </PageShell>
  );
}
