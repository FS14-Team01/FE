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
      // 갤러리는 list/infinite/summary로 키가 나뉘어 있어 all로 한 번에 무효화한다.
      // lists()만 무효화하면 목록이 쓰는 infinite 캐시가 남아 새로고침 전까지 갱신되지 않는다.
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

export default usePurchaseSale;
