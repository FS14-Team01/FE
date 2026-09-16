"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { galleryKeys, marketKeys, saleKeys } from "@/lib/query-keys";
import { createSale, getMyOwnerships } from "../api/sales-api";

export function useMyOwnerships(filters, enabled = true) {
  return useInfiniteQuery({
    queryKey: galleryKeys.list(filters),
    queryFn: ({ pageParam }) =>
      getMyOwnerships({
        ...filters,
        ...(pageParam ? { cursor: pageParam } : {}),
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: marketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}
