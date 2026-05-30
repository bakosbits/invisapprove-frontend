import { apiRequest } from "./client";
import type { User } from "./types";

export const usersApi = {
  list: (): Promise<User[]> => apiRequest("/auth/users"),
};
