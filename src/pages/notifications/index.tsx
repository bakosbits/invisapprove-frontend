import { formatDistanceToNow } from "date-fns";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Badge } from "../../components/ui/badge";
import { EmptyState } from "../../components/ui/empty-state";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useNotifications } from "../../hooks/use-notifications";
import type { DeliveryLog } from "../../api/types";

const CHANNEL_ICON: Record<DeliveryLog["channel"], React.ElementType> = {
  slack: MessageSquare,
  teams: MessageSquare,
  email: Mail,
};

const CHANNEL_LABEL: Record<DeliveryLog["channel"], string> = {
  slack: "Slack",
  teams: "Teams",
  email: "Email",
};

const STATUS_VARIANT: Record<
  DeliveryLog["status"],
  "approved" | "rejected" | "pending" | "auto_approved"
> = {
  sent: "approved",
  failed: "rejected",
  dead_letter: "rejected",
};

function ChannelBadge({ channel }: { channel: DeliveryLog["channel"] }) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-slate-700/50 text-slate-300">
      <Icon className="h-3 w-3" />
      {CHANNEL_LABEL[channel]}
    </span>
  );
}

export function NotificationsPage() {
  const { data: logs, isLoading } = useNotifications();

  return (
    <PageShell title="Notifications">
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Delivery log for all outbound notifications — Slack, Teams, and email.
        </p>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-card" />
            ))}
          </div>
        ) : !logs?.length ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="Notifications will appear here once approvals are created and processed"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(logs as DeliveryLog[]).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <ChannelBadge channel={log.channel} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[log.status]} dot>
                      {log.status === "dead_letter" ? "Dead letter" : log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {log.approval_id ? `${log.approval_id.slice(0, 8)}…` : "—"}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {log.error_msg ? (
                      <span className="text-xs text-rose-400 truncate block">{log.error_msg}</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
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
