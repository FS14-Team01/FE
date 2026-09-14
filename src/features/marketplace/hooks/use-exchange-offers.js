"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { exchangeKeys } from "@/lib/query-keys";
import { getExchangeOffers } from "../api/sales-api";

function useExchangeOffers(saleId, pageSize) {
  return useInfiniteQuery({
    queryKey: exchangeKeys.receivedBySale(saleId, { limit: pageSize }),
    queryFn: ({ pageParam }) =>
      getExchangeOffers(saleId, {
        cursor: pageParam,
        limit: pageSize,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(saleId),
  });
}

export default useExchangeOffers;
