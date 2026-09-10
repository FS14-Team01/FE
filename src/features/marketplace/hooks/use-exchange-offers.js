"use client";

import { useQuery } from "@tanstack/react-query";
import { exchangeKeys } from "@/lib/query-keys";
import { getExchangeOffers } from "../api/sales-api";

function useExchangeOffers(saleId) {
  return useQuery({
    queryKey: exchangeKeys.receivedBySale(saleId, {}),
    queryFn: () => getExchangeOffers(saleId),
    enabled: Boolean(saleId),
  });
}

export default useExchangeOffers;
