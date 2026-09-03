import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 300 * 1000,
      refetchOnWindowFocus: false,

      retry: (failureCount, error) => {
        return error?.code === 'NETWORK_ERROR' || error?.status >= 500;
      },
    },

    mutations: {
      retry: false,
    },
  },
});

export default queryClient