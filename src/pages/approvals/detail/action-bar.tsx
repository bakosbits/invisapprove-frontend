import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import type { Approval } from "../../../api/types";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/input";
import { useMutateApproval } from "../../../hooks/use-approvals";
import { useAuth } from "../../../hooks/use-auth";
import { useUIStore } from "../../../stores/ui.store";

interface ActionBarProps {
  approval: Approval | undefined;
}

type ActionType = "approve" | "reject" | null;

export function ActionBar({ approval }: ActionBarProps) {
  const { user } = useAuth();
  const { approve, reject } = useMutateApproval();
  const addToast = useUIStore((s) => s.addToast);
  const [pendingAction, setPendingAction] = useState<ActionType>(null);
  const [reason, setReason] = useState("");

  if (!approval || approval.status !== "pending") return null;

  const isLoading = approve.isPending || reject.isPending;

  const handleConfirm = async () => {
    if (!user || !approval) return;
    try {
      if (pendingAction === "approve") {
        await approve.mutateAsync({ id: approval.id, actorId: user.id, reason: reason || undefined });
        addToast("Approval approved", "success");
      } else if (pendingAction === "reject") {
        await reject.mutateAsync({ id: approval.id, actorId: user.id, reason: reason || undefined });
        addToast("Approval rejected", "info");
      }
    } finally {
      setPendingAction(null);
      setReason("");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 rounded-card border border-invisapprove-border bg-invisapprove-surface p-3">
        <p className="flex-1 text-xs text-slate-400">This request is awaiting your decision.</p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setPendingAction("reject")}
            disabled={isLoading}
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => setPendingAction("approve")}
            disabled={isLoading}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approve
          </Button>
        </div>
      </div>

      <Dialog open={pendingAction !== null} onOpenChange={() => setPendingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "approve" ? "Approve this request?" : "Reject this request?"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === "approve"
                ? "This will approve the request and notify the requester."
                : "This will reject the request. You can add a reason below."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <Textarea
              label="Reason (optional)"
              placeholder="Add a note…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingAction(null)}>
              Cancel
            </Button>
            <Button
              variant={pendingAction === "reject" ? "destructive" : "primary"}
              onClick={() => void handleConfirm()}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing…"
                : pendingAction === "approve"
                ? "Confirm approval"
                : "Confirm rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
