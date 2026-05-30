import { formatDistanceToNow } from "date-fns";
import { Link2, MessageSquare, Monitor } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { EmptyState } from "../../components/ui/empty-state";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useIntegrationEvents } from "../../hooks/use-integrations";
import type { AuditLog } from "../../api/types";

const SOURCE_META: Record<string, { label: string; icon: React.ElementType }> = {
  slack: { label: "Slack", icon: MessageSquare },
  teams: { label: "Teams", icon: Monitor },
};

const EVENT_LABEL: Record<string, string> = {
  "slack.approve": "Approved",
  "slack.reject": "Rejected",
  "slack.create_approval": "Created approval",
  "teams.approve": "Approved",
  "teams.reject": "Rejected",
};

const EVENT_VARIANT: Record<string, "approved" | "rejected" | "primary" | "default"> = {
  "slack.approve": "approved",
  "slack.reject": "rejected",
  "slack.create_approval": "primary",
  "teams.approve": "approved",
  "teams.reject": "rejected",
};

function SourceBadge({ event }: { event: string }) {
  const source = event.split(".")[0] ?? "unknown";
  const meta = SOURCE_META[source];
  if (!meta) return <span className="text-xs text-slate-500">{source}</span>;
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-slate-700/50 text-slate-300">
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

export function IntegrationsPage() {
  const { data: events, isLoading } = useIntegrationEvents();

  return (
    <PageShell title="Integrations">
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Inbound webhook events from Slack and Teams — approvals actioned outside the dashboard.
        </p>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-card" />
            ))}
          </div>
        ) : !events?.length ? (
          <EmptyState
            icon={Link2}
            title="No integration events yet"
            description="Events will appear here once approvals are actioned via Slack or Teams"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(events as AuditLog[]).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <SourceBadge event={log.event} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={EVENT_VARIANT[log.event] ?? "default"} dot={false}>
                      {EVENT_LABEL[log.event] ?? log.event}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {log.resource_id ? `${log.resource_id.slice(0, 8)}…` : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {log.actor_id ? `${log.actor_id.slice(0, 8)}…` : "—"}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageShell>
  );
}
