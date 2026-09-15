"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryKeys, marketKeys, pointKeys } from "@/lib/query-keys";
import { purchaseSale } from "../api/sales-api.js";

/* 구매 하나로 재고·포인트·소유 카드가 함께 바뀌어 4개 도메인을 무효화합니다 */
function usePurchaseSale(saleId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quantity) => purchaseSale(saleId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: marketKeys.detail(saleId) });
      queryClient.invalidateQueries({ queryKey: pointKeys.me() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
    },
  });
}

export default usePurchaseSale;
