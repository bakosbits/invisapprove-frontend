import { useParams } from "react-router-dom";
import { PageShell } from "../../../components/layout/page-shell";
import { useApproval } from "../../../hooks/use-approvals";
import { ActionBar } from "./action-bar";
import { ApprovalHeader } from "./approval-header";
import { ApprovalMetadata } from "./approval-metadata";
import { ApprovalTimeline } from "./approval-timeline";

export function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: approval, isLoading } = useApproval(id ?? "");

  return (
    <PageShell title="Approval detail">
      <div className="mx-auto max-w-4xl space-y-5">
        <ApprovalHeader approval={approval} loading={isLoading} />
        <ActionBar approval={approval} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ApprovalTimeline
              actions={approval?.actions}
              createdAt={approval?.created_at}
              loading={isLoading}
            />
          </div>
          <ApprovalMetadata approval={approval} loading={isLoading} />
        </div>
      </div>
    </PageShell>
  );
}
