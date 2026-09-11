"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exchangeKeys, marketKeys, saleKeys } from "@/lib/query-keys";
import { stopSale, updateSale } from "../api/sales-api";

function mergeSaleDetail(queryClient, saleId, updatedSale) {
  queryClient.setQueryData(marketKeys.detail(saleId), (previousSale) =>
    previousSale ? { ...previousSale, ...updatedSale } : previousSale,
  );
}

function invalidateRelatedQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: marketKeys.lists() });
  queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
  queryClient.invalidateQueries({ queryKey: exchangeKeys.received() });
}

export function useUpdateSale(saleId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData) => updateSale(saleId, updateData),
    onSuccess: (updatedSale) => {
      mergeSaleDetail(queryClient, saleId, updatedSale);
      invalidateRelatedQueries(queryClient);
    },
  });
}

export function useStopSale(saleId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stopSale(saleId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: marketKeys.detail(saleId),
        exact: true,
      });
      invalidateRelatedQueries(queryClient);
    },
  });
}
