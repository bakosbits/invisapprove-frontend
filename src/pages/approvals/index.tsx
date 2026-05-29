import { useMemo, useState } from "react";
import type { ApprovalStatus } from "../../api/types";
import { PageShell } from "../../components/layout/page-shell";
import { Card } from "../../components/ui/card";
import { useApprovals } from "../../hooks/use-approvals";
import { ApprovalFilters } from "./approval-filters";
import { ApprovalsTable } from "./approvals-table";
import { CreateApprovalDialog } from "./create-approval-dialog";

export function ApprovalsPage() {
  const { data: approvals, isLoading } = useApprovals();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | null>(null);

  const filtered = useMemo(() => {
    let result = approvals ?? [];
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [approvals, search, statusFilter]);

  return (
    <PageShell
      title="Approvals"
      actions={<CreateApprovalDialog />}
    >
      <div className="mx-auto max-w-5xl space-y-4">
        <ApprovalFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <Card className="overflow-hidden">
          <ApprovalsTable approvals={filtered} loading={isLoading} />
        </Card>
      </div>
    </PageShell>
  );
}
