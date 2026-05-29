import { cn } from "../../lib/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded bg-gradient-to-r from-invisapprove-surface via-invisapprove-muted to-invisapprove-surface bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}
