import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import type { ApprovalStatus } from "../../api/types";
import { StatusBadge } from "./badge";

interface StatusTransitionProps {
  status: ApprovalStatus;
  className?: string;
}

/**
 * Renders a StatusBadge with a scale + opacity animation whenever the status
 * prop changes. The badge briefly shrinks out then snaps back in at the new value.
 */
export function StatusTransition({ status, className }: StatusTransitionProps) {
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const prevStatus = useRef(status);

  useEffect(() => {
    if (prevStatus.current === status) return;
    prevStatus.current = status;

    setPhase("out");
    const t1 = setTimeout(() => setPhase("in"), 150);
    const t2 = setTimeout(() => setPhase("idle"), 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [status]);

  return (
    <span
      className={cn(
        "inline-flex transition-all",
        phase === "out" && "scale-90 opacity-0 duration-150",
        phase === "in" && "scale-110 opacity-100 duration-100",
        phase === "idle" && "scale-100 opacity-100 duration-200",
        className
      )}
    >
      <StatusBadge status={status} />
    </span>
  );
}
