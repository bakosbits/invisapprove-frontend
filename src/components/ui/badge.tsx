import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import type { ApprovalStatus } from "../../api/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        pending: "bg-amber-500/15 text-amber-400",
        approved: "bg-emerald-500/15 text-emerald-400",
        rejected: "bg-rose-500/15 text-rose-400",
        auto_approved: "bg-violet-500/15 text-violet-400",
        default: "bg-slate-500/15 text-slate-400",
        primary: "bg-invisapprove-primary-subtle text-indigo-300",
        shadow: "bg-slate-700/50 text-slate-400 border border-slate-600/50",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-amber-400": variant === "pending",
            "bg-emerald-400": variant === "approved",
            "bg-rose-400": variant === "rejected",
            "bg-violet-400": variant === "auto_approved",
            "bg-slate-400": !variant || variant === "default",
            "bg-indigo-400": variant === "primary",
          })}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  const labels: Record<ApprovalStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    auto_approved: "Auto-approved",
  };
  return (
    <Badge variant={status}>
      {labels[status]}
    </Badge>
  );
}
