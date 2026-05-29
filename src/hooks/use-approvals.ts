import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approvalsApi } from "../api/approvals";
import type { CreateApprovalPayload } from "../api/types";

export function useApprovals() {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: approvalsApi.list,
    staleTime: 15_000,
  });
}

export function useApproval(id: string) {
  return useQuery({
    queryKey: ["approvals", id],
    queryFn: () => approvalsApi.getById(id),
    enabled: !!id,
  });
}

export function useMutateApproval() {
  const qc = useQueryClient();

  const invalidate = (id?: string) => {
    void qc.invalidateQueries({ queryKey: ["approvals"] });
    if (id) void qc.invalidateQueries({ queryKey: ["approvals", id] });
  };

  const create = useMutation({
    mutationFn: (payload: CreateApprovalPayload) => approvalsApi.create(payload),
    onSuccess: () => invalidate(),
  });

  const approve = useMutation({
    mutationFn: ({ id, actorId, reason }: { id: string; actorId: string; reason?: string }) =>
      approvalsApi.approve(id, actorId, reason),
    onSuccess: (_, { id }) => invalidate(id),
  });

  const reject = useMutation({
    mutationFn: ({ id, actorId, reason }: { id: string; actorId: string; reason?: string }) =>
      approvalsApi.reject(id, actorId, reason),
    onSuccess: (_, { id }) => invalidate(id),
  });

  return { create, approve, reject };
}
