import { PageShell } from "../../components/layout/page-shell";
import { useApprovals } from "../../hooks/use-approvals";
import { useRules } from "../../hooks/use-rules";
import { ApprovalChart } from "./approval-chart";
import { CategoryBreakdown } from "./category-breakdown";
import { MetricsRow } from "./metrics-row";
import { RecentActivity } from "./recent-activity";
import { RuleHitRateChart } from "./rule-hit-rate-chart";
import { SlaComplianceChart } from "./sla-compliance-chart";

export function DashboardPage() {
  const { data: approvals, isLoading } = useApprovals();
  const { data: rules, isLoading: rulesLoading } = useRules();

  return (
    <PageShell title="Dashboard">
      <div className="mx-auto max-w-5xl space-y-5">
        <MetricsRow approvals={approvals} loading={isLoading} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ApprovalChart approvals={approvals} loading={isLoading} />
          <RecentActivity approvals={approvals} loading={isLoading} />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <CategoryBreakdown approvals={approvals} loading={isLoading} />
          <RuleHitRateChart rules={rules} loading={rulesLoading} />
          <SlaComplianceChart approvals={approvals} loading={isLoading} />
        </div>
      </div>
    </PageShell>
  );
}
