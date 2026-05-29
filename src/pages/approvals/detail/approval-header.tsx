import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Approval } from "../../../api/types";
import { StatusTransition } from "../../../components/ui/status-transition";
import { Skeleton } from "../../../components/ui/skeleton";

interface ApprovalHeaderProps {
  approval: Approval | undefined;
  loading: boolean;
}

export function ApprovalHeader({ approval, loading }: ApprovalHeaderProps) {
  return (
    <div>
      <Link
        to="/approvals"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to approvals
      </Link>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : approval ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">{approval.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-xs text-slate-600">{approval.id}</span>
              {approval.category && (
                <span className="rounded px-1.5 py-0.5 text-xs bg-invisapprove-muted text-slate-400">
                  {approval.category}
                </span>
              )}
              {approval.amount != null && (
                <span className="font-mono text-xs text-slate-400 tabular">
                  ${approval.amount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <StatusTransition status={approval.status} />
        </div>
      ) : null}
    </div>
  );
}
