import { format } from "date-fns";
import type { Approval } from "../../../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

interface ApprovalMetadataProps {
  approval: Approval | undefined;
  loading: boolean;
}

export function ApprovalMetadata({ approval, loading }: ApprovalMetadataProps) {
  const metaEntries = approval ? Object.entries(approval.metadata) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : approval ? (
          <dl className="space-y-3">
            <MetaRow label="Requester" value={approval.requester.name || approval.requester.id} mono />
            <MetaRow
              label="Created"
              value={format(new Date(approval.created_at), "MMM d, yyyy HH:mm")}
            />
            {approval.amount != null && (
              <MetaRow label="Amount" value={`$${approval.amount.toLocaleString()}`} mono />
            )}
            {approval.category && <MetaRow label="Category" value={approval.category} />}
            {approval.description && (
              <div>
                <dt className="text-xs text-slate-500 mb-1">Description</dt>
                <dd className="text-sm text-slate-300">{approval.description}</dd>
              </div>
            )}
            {metaEntries.length > 0 && (
              <>
                <div className="border-t border-invisapprove-border pt-3">
                  <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Metadata</p>
                  {metaEntries.map(([key, value]) => (
                    <MetaRow key={key} label={key} value={String(value)} mono />
                  ))}
                </div>
              </>
            )}
          </dl>
        ) : null}
      </CardContent>
    </Card>
  );
}

function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs text-slate-500 shrink-0">{label}</dt>
      <dd className={`text-xs truncate ${mono ? "font-mono text-slate-300" : "text-slate-300"}`}>
        {value}
      </dd>
    </div>
  );
}
