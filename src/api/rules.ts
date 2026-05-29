import { apiRequest } from "./client";
import type { CreateRulePayload, Rule, UpdateRulePayload } from "./types";

export const rulesApi = {
  list: (): Promise<Rule[]> =>
    apiRequest("/api/rules"),

  getById: (id: string): Promise<Rule> =>
    apiRequest(`/api/rules/${id}`),

  create: (payload: CreateRulePayload): Promise<{ id: string }> =>
    apiRequest("/api/rules", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateRulePayload): Promise<Rule> =>
    apiRequest(`/api/rules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
