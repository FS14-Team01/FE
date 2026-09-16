"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { saleKeys } from "@/lib/query-keys";
import { getMySales } from "../api/sales-api";

export default function useSalesList(filters) {
  return useInfiniteQuery({
    queryKey: saleKeys.list(filters),
    queryFn: ({ pageParam }) =>
      getMySales({
        ...filters,
        ...(pageParam ? { cursor: pageParam } : {}),
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}
