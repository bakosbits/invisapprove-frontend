import { format } from "date-fns";
import { CheckCircle2, Clock, XCircle, Zap } from "lucide-react";
import type { ApprovalAction } from "../../../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

const ACTION_CONFIG = {
  approved: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10", label: "Rejected" },
  auto_approved: { icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10", label: "Auto-approved" },
  escalated: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", label: "Escalated" },
} as const;

interface ApprovalTimelineProps {
  actions: ApprovalAction[] | undefined;
  createdAt: string | undefined;
  loading: boolean;
}

export function ApprovalTimeline({ actions, createdAt, loading }: ApprovalTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5 pt-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative space-y-4">
            {/* Created event */}
            {createdAt && (
              <TimelineEntry
                icon={Clock}
                iconColor="text-slate-400"
                iconBg="bg-slate-700"
                label="Request created"
                timestamp={createdAt}
              />
            )}
            {/* Actions */}
            {actions?.map((action, i) => {
              const config = ACTION_CONFIG[action.action];
              return (
                <TimelineEntry
                  key={i}
                  icon={config.icon}
                  iconColor={config.color}
                  iconBg={config.bg}
                  label={config.label}
                  sub={action.reason ?? undefined}
                  timestamp={action.created_at}
                  actor={action.actor_id}
                />
              );
            })}
            {!actions?.length && !createdAt && (
              <p className="text-sm text-slate-500">No actions yet</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TimelineEntry({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  sub,
  timestamp,
  actor,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  sub?: string;
  timestamp: string;
  actor?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm text-slate-200">{label}</p>
        {actor && (
          <p className="font-mono text-[11px] text-slate-600 truncate">{actor.slice(0, 12)}…</p>
        )}
        {sub && <p className="mt-0.5 text-xs text-slate-500 italic">"{sub}"</p>}
        <p className="mt-0.5 text-[11px] text-slate-600">
          {format(new Date(timestamp), "MMM d, yyyy 'at' HH:mm")}
        </p>
      </div>
    </div>
  );
}
