import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "../api/integrations";

export function useIntegrationEvents() {
  return useQuery({
    queryKey: ["integration-events"],
    queryFn: integrationsApi.listEvents,
    staleTime: 30_000,
  });
}
