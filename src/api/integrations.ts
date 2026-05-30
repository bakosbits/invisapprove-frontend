import { apiRequest } from "./client";
import type { AuditLog } from "./types";

export const integrationsApi = {
  listEvents: (): Promise<AuditLog[]> =>
    apiRequest("/api/integrations/events"),
};
