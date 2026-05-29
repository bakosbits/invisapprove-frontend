import type { Approval, ApprovalStatus } from "../../api/types";
import { AnimatedNumber } from "../../components/ui/animated-number";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { colors } from "../../design/tokens";

const METRICS: Array<{
  label: string;
  status: ApprovalStatus | null;
  color: string;
}> = [
  { label: "Pending", status: "pending", color: colors.status.pending },
  { label: "Approved", status: "approved", color: colors.status.approved },
  { label: "Rejected", status: "rejected", color: colors.status.rejected },
  { label: "Auto-approved", status: "auto_approved", color: colors.status.auto_approved },
];

interface MetricsRowProps {
  approvals: Approval[] | undefined;
  loading: boolean;
}

export function MetricsRow({ approvals, loading }: MetricsRowProps) {
  const counts = METRICS.map(({ label, status, color }) => ({
    label,
    color,
    count: status ? (approvals?.filter((a) => a.status === status).length ?? 0) : (approvals?.length ?? 0),
  }));

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <Skeleton className="h-7 w-12 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {counts.map(({ label, count, color }) => (
        <Card key={label} className="relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-0.5"
            style={{ background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)` }}
          />
          <CardContent className="pt-5">
            <p className="font-mono tabular text-2xl font-semibold" style={{ color }}>
              <AnimatedNumber value={count} />
            </p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
