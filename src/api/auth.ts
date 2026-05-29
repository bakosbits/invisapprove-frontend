import { apiRequest } from "./client";
import type { User } from "./types";

export const authApi = {
  me: (): Promise<User> =>
    apiRequest("/auth/me"),
};
