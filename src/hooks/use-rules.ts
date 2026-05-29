import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rulesApi } from "../api/rules";
import type { CreateRulePayload } from "../api/types";

export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: rulesApi.list,
    staleTime: 30_000,
  });
}

export function useCreateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRulePayload) => rulesApi.create(payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["rules"] }),
  });
}
