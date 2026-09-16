"use client";

import { useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { exchangeKeys } from "@/lib/query-keys";
import {
  cancelMyExchangeOffer,
  getMyExchangeOffers,
} from "../api/requester-exchange-api";

export default function useRequesterExchangeOffers({ saleId, requesterId }) {
  const queryClient = useQueryClient();
  const cancellingRef = useRef(false);
  const queryKey = exchangeKeys.sentList({ saleId, requesterId, limit: 12 });
  const offers = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam, signal }) =>
      getMyExchangeOffers({ saleId, cursor: pageParam, signal }),
    initialPageParam: undefined,
    getNextPageParam: (page) => (page.hasNext ? page.nextCursor : undefined),
    retry: false,
  });
  const cancellation = useMutation({
    mutationFn: cancelMyExchangeOffer,
    retry: false,
    onMutate: () => queryClient.cancelQueries({ queryKey }),
    onSuccess: (result) => {
      // 임의로 성공 상태를 만들지 않고 PATCH 성공 응답만 캐시에 반영한다.
      queryClient.setQueryData(
        queryKey,
        (previous) =>
          previous && {
            ...previous,
            pages: previous.pages.map((page) => ({
              ...page,
              items: page.items.map((offer) =>
                offer.id === result.id
                  ? { ...offer, status: result.status }
                  : offer,
              ),
            })),
          },
      );
    },
    // 이미 처리된 제안(409)도 재조회하여 서버의 실제 상태를 표시한다.
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: exchangeKeys.sent() }),
  });

  async function cancel(exchangeOfferId) {
    if (cancellingRef.current) return false;
    cancellingRef.current = true;
    try {
      await cancellation.mutateAsync(exchangeOfferId);
      return true;
    } catch {
      // 오류는 cancellation.error를 통해 카드 목록 위에 표시한다.
      return false;
    } finally {
      cancellingRef.current = false;
    }
  }

  return { offers, cancellation, cancel };
}
