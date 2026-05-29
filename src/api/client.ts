import type { ApiError } from "./types";

const API_BASE = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8787";

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiError
  ) {
    super(body.error);
    this.name = "ApiClientError";
  }
}

// Import the token getter lazily to avoid circular deps with the auth store
let _getToken: (() => string | null) | null = null;

export function setTokenGetter(fn: () => string | null) {
  _getToken = fn;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = _getToken?.();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" })) as ApiError;
    throw new ApiClientError(res.status, body);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
