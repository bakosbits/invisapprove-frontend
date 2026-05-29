import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import type { Approval } from "../../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { Skeleton } from "../../components/ui/skeleton";
import { StatusBadge } from "../../components/ui/badge";
import { Activity } from "lucide-react";

interface RecentActivityProps {
  approvals: Approval[] | undefined;
  loading: boolean;
}

export function RecentActivity({ approvals, loading }: RecentActivityProps) {
  const recent = approvals
    ?.slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-px px-5 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !recent?.length ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="Approvals will appear here once created"
          />
        ) : (
          <ul className="divide-y divide-invisapprove-border">
            {recent.map((approval) => (
              <li key={approval.id}>
                <Link
                  to={`/approvals/${approval.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-invisapprove-surface-raised transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-slate-200">{approval.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-600 truncate">
                      {approval.id.slice(0, 8)}…
                      {approval.amount != null && (
                        <span className="ml-2 text-slate-500">
                          ${approval.amount.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={approval.status} />
                    <span className="text-[11px] text-slate-600">
                      {formatDistanceToNow(new Date(approval.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
