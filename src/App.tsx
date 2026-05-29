import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuthStore } from "./stores/auth.store";
import { AppRouter } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={400}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
