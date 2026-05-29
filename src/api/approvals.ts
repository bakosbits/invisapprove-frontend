import { apiRequest } from "./client";
import type { Approval, CreateApprovalPayload } from "./types";

export const approvalsApi = {
  list: (): Promise<Approval[]> =>
    apiRequest("/api/approvals"),

  getById: (id: string): Promise<Approval> =>
    apiRequest(`/api/approvals/${id}`),

  create: (payload: CreateApprovalPayload): Promise<{ id: string; status: string; created_at: string }> =>
    apiRequest("/api/approvals", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  approve: (id: string, actorId: string, reason?: string): Promise<{ status: string }> =>
    apiRequest(`/api/approvals/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ actor_id: actorId, reason }),
    }),

  reject: (id: string, actorId: string, reason?: string): Promise<{ status: string }> =>
    apiRequest(`/api/approvals/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ actor_id: actorId, reason }),
    }),
};
