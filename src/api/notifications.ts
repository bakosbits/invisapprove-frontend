import { apiRequest } from "./client";
import type { DeliveryLog } from "./types";

export const notificationsApi = {
  list: (): Promise<DeliveryLog[]> =>
    apiRequest("/api/notifications"),
};
