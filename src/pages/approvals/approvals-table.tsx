import { formatDistanceToNow } from "date-fns";
import { CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Approval } from "../../api/types";
import { StatusBadge } from "../../components/ui/badge";
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
import { CreateApprovalDialog } from "./create-approval-dialog";

interface ApprovalsTableProps {
  approvals: Approval[] | undefined;
  loading: boolean;
}

export function ApprovalsTable({ approvals, loading }: ApprovalsTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-card" />
        ))}
      </div>
    );
  }

  if (!approvals?.length) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No approvals yet"
        description="Create your first approval request to get started"
        action={<CreateApprovalDialog />}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {approvals.map((approval) => (
          <TableRow key={approval.id} onClick={() => navigate(`/approvals/${approval.id}`)}>
            <TableCell>
              <div>
                <p className="font-medium text-slate-200 truncate max-w-xs">{approval.title}</p>
                <p className="font-mono text-[11px] text-slate-600 mt-0.5">
                  {approval.id.slice(0, 8)}…
                </p>
              </div>
            </TableCell>
            <TableCell>
              {approval.category ? (
                <span className="rounded px-1.5 py-0.5 text-xs bg-invisapprove-muted text-slate-400">
                  {approval.category}
                </span>
              ) : (
                <span className="text-slate-600">—</span>
              )}
            </TableCell>
            <TableCell className="text-right font-mono tabular">
              {approval.amount != null ? (
                <span className="text-slate-200">${approval.amount.toLocaleString()}</span>
              ) : (
                <span className="text-slate-600">—</span>
              )}
            </TableCell>
            <TableCell>
              <StatusBadge status={approval.status} />
            </TableCell>
            <TableCell className="text-slate-500 text-xs">
              {formatDistanceToNow(new Date(approval.created_at), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
