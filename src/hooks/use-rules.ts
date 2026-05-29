import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rulesApi } from "../api/rules";
import type { CreateRulePayload, UpdateRulePayload } from "../api/types";

export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: rulesApi.list,
    staleTime: 30_000,
  });
}

export function useRule(id: string) {
  return useQuery({
    queryKey: ["rules", id],
    queryFn: () => rulesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRulePayload) => rulesApi.create(payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["rules"] }),
  });
}

export function useUpdateRule(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRulePayload) => rulesApi.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rules"] });
      void qc.invalidateQueries({ queryKey: ["rules", id] });
    },
  });
}
