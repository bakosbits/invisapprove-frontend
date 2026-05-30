import { useState } from "react";
import { Link2, Bell, Users, Shield, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/cn";

const API_BASE = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8787";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy">
      {copied
        ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        : <Copy className="h-3.5 w-3.5 text-slate-400" />}
    </Button>
  );
}

type Tab = "integrations" | "notifications" | "team";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
];

const INTEGRATIONS = [
  {
    name: "Slack",
    description: "Post approval requests and receive approve/reject actions directly in Slack.",
    connected: false,
    webhookPath: "/integrations/slack/events",
    actionsPath: "/integrations/slack/actions",
    secrets: ["SLACK_SIGNING_SECRET", "SLACK_BOT_TOKEN", "SLACK_CHANNEL"],
    docsHref: "https://api.slack.com/apps",
  },
  {
    name: "Microsoft Teams",
    description: "Send Adaptive Card approval requests to Teams channels.",
    connected: false,
    webhookPath: "/integrations/teams/webhook",
    actionsPath: null,
    secrets: ["TEAMS_INCOMING_WEBHOOK_URL", "TEAMS_WEBHOOK_TOKEN"],
    docsHref: "https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook",
  },
] as const;

function IntegrationCard({
  name,
  description,
  connected,
  webhookPath,
  actionsPath,
  secrets,
  docsHref,
}: (typeof INTEGRATIONS)[number]) {
  const webhookUrl = `${API_BASE}${webhookPath}`;
  const actionsUrl = actionsPath ? `${API_BASE}${actionsPath}` : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          {connected
            ? <Badge variant="approved" dot>Connected</Badge>
            : <Badge variant="default" dot={false}>Not connected</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-slate-500">{description}</p>

        <div className="space-y-2">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">
              {actionsUrl ? "Events URL" : "Webhook URL"}
            </p>
            <div className="flex items-center gap-1 rounded-input border border-invisapprove-border bg-invisapprove-bg px-3 py-1.5">
              <code className="flex-1 truncate font-mono text-xs text-slate-300">{webhookUrl}</code>
              <CopyButton value={webhookUrl} />
            </div>
          </div>
          {actionsUrl && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Actions URL</p>
              <div className="flex items-center gap-1 rounded-input border border-invisapprove-border bg-invisapprove-bg px-3 py-1.5">
                <code className="flex-1 truncate font-mono text-xs text-slate-300">{actionsUrl}</code>
                <CopyButton value={actionsUrl} />
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 mb-1.5">Required Worker secrets</p>
          <div className="flex flex-wrap gap-1.5">
            {secrets.map((s) => (
              <code key={s} className="rounded bg-invisapprove-muted px-1.5 py-0.5 text-[11px] text-slate-300 border border-invisapprove-border">
                {s}
              </code>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-invisapprove-border">
          <a href={docsHref} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-3.5 w-3.5" />
              Docs
            </Button>
          </a>
          <Button variant={connected ? "destructive" : "outline"} size="sm" disabled={!connected}>
            {connected ? "Disconnect" : "Configure via Worker secrets"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-4">
      {INTEGRATIONS.map((integration) => (
        <IntegrationCard key={integration.name} {...integration} />
      ))}
    </div>
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
