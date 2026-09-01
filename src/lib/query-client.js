import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분 동안 최신 데이터로 취급
      gcTime: 300 * 1000,   // 사용하지 않는 캐시도 5분간 보관
      refetchOnWindowFocus: false,

      retry: (failureCount, error) => {
        return error.status >= 500 && failureCount < 1;
      },
    },

  }
});