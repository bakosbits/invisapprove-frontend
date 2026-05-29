// JS color constants — used in Recharts and other non-CSS contexts.
// The canonical source is tailwind.config.ts; keep these in sync.

export const colors = {
  bg: "#0B0F1A",
  surface: "#121828",
  surfaceRaised: "#172033",
  border: "#1E2A3F",
  muted: "#2A3547",
  primary: "#5B4FD9",
  primaryHover: "#4A3FC5",
  accent: "#F59E0B",
  text: {
    primary: "#F1F5F9",
    secondary: "#94A3B8",
    muted: "#64748B",
  },
  status: {
    pending: "#F59E0B",
    approved: "#10B981",
    rejected: "#F43F5E",
    auto_approved: "#8B5CF6",
  },
} as const;
