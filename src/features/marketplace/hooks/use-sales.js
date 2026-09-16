"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { marketKeys } from "@/lib/query-keys";
import { getSales } from "../api/sales-api";

function useSales(filters, pageSize) {
  return useInfiniteQuery({
    queryKey: marketKeys.list({ ...filters, limit: pageSize }),
    queryFn: ({ pageParam }) =>
      getSales({
        ...filters,
        cursor: pageParam,
        limit: pageSize,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export default useSales;
