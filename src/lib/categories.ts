export const CATEGORY_SLUGS = [
  "time_attendance",
  "finance_expense",
  "finance_procurement",
  "operations_access",
  "human_resources",
  "legal_compliance",
  "general",
] as const;

export type ApprovalCategory = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_LABELS: Record<ApprovalCategory, string> = {
  time_attendance: "Time & Attendance",
  finance_expense: "Finance - Expense",
  finance_procurement: "Finance - Procurement",
  operations_access: "Operations & Access",
  human_resources: "Human Resources",
  legal_compliance: "Legal & Compliance",
  general: "General",
};

// Categories that require a top-level amount field
export const AMOUNT_REQUIRED_CATEGORIES = new Set<ApprovalCategory>([
  "finance_expense",
  "finance_procurement",
]);

// Categories where the amount field is shown at all (required or optional)
export const AMOUNT_APPLICABLE_CATEGORIES = new Set<ApprovalCategory>([
  "finance_expense",
  "finance_procurement",
  "general",
]);

// ---------------------------------------------------------------------------
// Per-category metadata field definitions — drives the create-approval form
// ---------------------------------------------------------------------------

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: readonly string[];
};

export const CATEGORY_METADATA_FIELDS: Record<ApprovalCategory, FieldDef[]> = {
  time_attendance: [
    { key: "employee_id", label: "Employee ID", type: "text", required: true },
    {
      key: "date_range",
      label: "Date Range",
      type: "text",
      required: true,
      placeholder: "e.g. Jan 1–7, 2025",
    },
    {
      key: "leave_type",
      label: "Leave Type",
      type: "select",
      required: false,
      options: ["vacation", "sick", "personal", "overtime", "shift_swap"],
    },
    { key: "hours", label: "Hours", type: "number", required: false },
    { key: "coverage_required", label: "Coverage Required", type: "checkbox", required: false },
  ],

  finance_expense: [
    { key: "cost_center", label: "Cost Center", type: "text", required: true },
    { key: "vendor", label: "Vendor", type: "text", required: false },
    { key: "budget_code", label: "Budget Code", type: "text", required: false },
  ],

  finance_procurement: [
    { key: "vendor", label: "Vendor", type: "text", required: true },
    {
      key: "contract_type",
      label: "Contract Type",
      type: "select",
      required: false,
      options: ["purchase_order", "invoice", "license", "contract", "other"],
    },
    { key: "cost_center", label: "Cost Center", type: "text", required: false },
    { key: "budget_code", label: "Budget Code", type: "text", required: false },
  ],

  operations_access: [
    { key: "system_name", label: "System / Tool", type: "text", required: true },
    {
      key: "access_level",
      label: "Access Level",
      type: "text",
      required: true,
      placeholder: "e.g. read-only, admin",
    },
    { key: "justification", label: "Justification", type: "text", required: true },
    {
      key: "sensitivity_level",
      label: "Sensitivity",
      type: "select",
      required: false,
      options: ["low", "medium", "high", "critical"],
    },
  ],

  human_resources: [
    { key: "position_id", label: "Position ID", type: "text", required: false },
    { key: "candidate_id", label: "Candidate ID", type: "text", required: false },
    { key: "hr_partner", label: "HR Partner", type: "text", required: false },
    {
      key: "compensation_change",
      label: "Compensation Change ($)",
      type: "number",
      required: false,
    },
    {
      key: "review_period",
      label: "Review Period",
      type: "text",
      required: false,
      placeholder: "e.g. Q1 2025",
    },
  ],

  legal_compliance: [
    {
      key: "document_type",
      label: "Document Type",
      type: "select",
      required: true,
      options: ["nda", "contract", "policy_exception", "regulatory", "other"],
    },
    { key: "counterparty", label: "Counterparty", type: "text", required: false },
    {
      key: "risk_level",
      label: "Risk Level",
      type: "select",
      required: false,
      options: ["low", "medium", "high"],
    },
    { key: "legal_reviewer", label: "Legal Reviewer", type: "text", required: false },
    {
      key: "expiry_date",
      label: "Expiry Date",
      type: "text",
      required: false,
      placeholder: "YYYY-MM-DD",
    },
  ],

  general: [],
};

// ---------------------------------------------------------------------------
// All known metadata field keys grouped by category — used by condition builder
// ---------------------------------------------------------------------------

export const CONDITION_FIELDS: Array<{ group: string; fields: string[] }> = [
  {
    group: "Approval",
    fields: ["amount", "category", "requester_id"],
  },
  {
    group: "Time & Attendance",
    fields: ["employee_id", "leave_type", "hours", "coverage_required", "date_range"],
  },
  {
    group: "Finance",
    fields: ["vendor", "cost_center", "budget_code", "contract_type"],
  },
  {
    group: "Operations & Access",
    fields: ["system_name", "access_level", "justification", "sensitivity_level"],
  },
  {
    group: "Human Resources",
    fields: ["position_id", "candidate_id", "hr_partner", "compensation_change", "review_period"],
  },
  {
    group: "Legal & Compliance",
    fields: ["document_type", "counterparty", "risk_level", "legal_reviewer"],
  },
];
