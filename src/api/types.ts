import type { ApprovalCategory } from "../lib/categories";

export type { ApprovalCategory };

export type ApprovalStatus = "pending" | "approved" | "rejected" | "auto_approved";

export type ApprovalAction = {
  actor_id: string;
  action: "approved" | "rejected" | "auto_approved" | "escalated";
  reason: string | null;
  created_at: string;
};

export type Approval = {
  id: string;
  title: string;
  description: string | null;
  status: ApprovalStatus;
  requester: { id: string; name: string };
  approver_id: string | null;
  actions: ApprovalAction[];
  metadata: Record<string, unknown>;
  amount?: number | null;
  category?: ApprovalCategory | null;
  created_at: string;
};

export type CreateApprovalPayload = {
  title: string;
  description?: string;
  requester_id: string;
  approver_id?: string | null;
  metadata?: Record<string, unknown>;
  amount?: number;
  category: ApprovalCategory;
};

export type RuleCondition = {
  field: string;
  operator: "<" | "<=" | ">" | ">=" | "=" | "!=" | "in" | "not_in" | "exists";
  value: unknown;
};

export type RuleAction = {
  type: "auto_approve" | "escalate" | "require_approval";
};

export type Rule = {
  id: string;
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  enabled: boolean;
  shadow: boolean;
  priority: number;
  created_at: string;
};

export type CreateRulePayload = {
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  enabled: boolean;
  shadow?: boolean;
  priority?: number;
};

export type UpdateRulePayload = Partial<CreateRulePayload>;

export type DeliveryLog = {
  id: string;
  approval_id: string | null;
  channel: "slack" | "teams" | "email";
  status: "sent" | "failed" | "dead_letter";
  payload: unknown;
  error_msg: string | null;
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  event: string;
  resource_type: string | null;
  resource_id: string | null;
  payload: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

export type ApiError = { error: string; details?: string };
