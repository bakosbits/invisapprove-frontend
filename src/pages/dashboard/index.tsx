import { PageShell } from "../../components/layout/page-shell";
import { useApprovals } from "../../hooks/use-approvals";
import { ApprovalChart } from "./approval-chart";
import { MetricsRow } from "./metrics-row";
import { RecentActivity } from "./recent-activity";

export function DashboardPage() {
  const { data: approvals, isLoading } = useApprovals();

  return (
    <PageShell title="Dashboard">
      <div className="mx-auto max-w-5xl space-y-5">
        <MetricsRow approvals={approvals} loading={isLoading} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ApprovalChart approvals={approvals} loading={isLoading} />
          <RecentActivity approvals={approvals} loading={isLoading} />
        </div>
      </div>
    </PageShell>
  );
}
