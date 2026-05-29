import { apiRequest } from "./client";
import type { CreateRulePayload, Rule } from "./types";

export const rulesApi = {
  list: (): Promise<Rule[]> =>
    apiRequest("/api/rules"),

  create: (payload: CreateRulePayload): Promise<{ id: string }> =>
    apiRequest("/api/rules", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
