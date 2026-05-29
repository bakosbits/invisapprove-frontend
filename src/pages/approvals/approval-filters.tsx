import { Search, X } from "lucide-react";
import type { ApprovalStatus } from "../../api/types";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

const STATUSES: Array<{ value: ApprovalStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "auto_approved", label: "Auto-approved" },
];

interface ApprovalFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: ApprovalStatus | null;
  onStatusChange: (v: ApprovalStatus | null) => void;
}

export function ApprovalFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: ApprovalFiltersProps) {
  const hasFilters = search || statusFilter;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          placeholder="Search approvals…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-56 rounded-input border border-invisapprove-border bg-invisapprove-surface pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-invisapprove-primary focus:ring-1 focus:ring-invisapprove-primary transition-colors"
        />
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-1">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(statusFilter === s.value ? null : s.value)}
            className="focus:outline-none rounded-full"
          >
            <Badge
              variant={statusFilter === s.value ? s.value : "default"}
              className={
                statusFilter !== s.value
                  ? "opacity-50 hover:opacity-80 cursor-pointer transition-opacity"
                  : "cursor-pointer"
              }
            >
              {s.label}
            </Badge>
          </button>
        ))}
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { onSearchChange(""); onStatusChange(null); }}
          className="h-7 gap-1 text-xs text-slate-500"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
