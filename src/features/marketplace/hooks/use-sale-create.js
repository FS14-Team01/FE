"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { galleryKeys, marketKeys, saleKeys } from "@/lib/query-keys";
import {
  createSale,
  getMyOwnerships,
  getMyOwnershipFilterSummary,
} from "../api/sales-api";

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
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: marketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: saleKeys.all });
    },
  });
}

export function useOwnershipFilterSummary(keyword = "", enabled = true) {
  const normalizedKeyword = keyword.trim();
  return useQuery({
    queryKey: galleryKeys.summary(normalizedKeyword),
    queryFn: () => getMyOwnershipFilterSummary(normalizedKeyword),
    enabled,
  });
}
