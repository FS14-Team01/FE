"use client";

import { useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { exchangeKeys, galleryKeys, marketKeys } from "@/lib/query-keys";
import { getOwnerships } from "../../api/ownerships-api";
import { createExchangeOffer } from "../../api/sales-api";
import ExchangeModal from "./ExchangeModal";

// API 연동은 이 컨테이너에서만 담당하고 ExchangeModal은 데이터/콜백을 받는다.
export default function ExchangeRequestModal({
  saleId,
  onClose,
  onSuccess,
  onSaleUnavailable,
}) {
  const [filters, setFilters] = useState({
    keyword: "",
    grade: "",
    category: "",
  });
  const submittingRef = useRef(false);
  const queryClient = useQueryClient();
  const ownerships = useInfiniteQuery({
    queryKey: galleryKeys.list({ ...filters, limit: 12 }),
    queryFn: ({ pageParam, signal }) =>
      getOwnerships({ filters, cursor: pageParam, signal }),
    initialPageParam: undefined,
    getNextPageParam: (page) => (page.hasNext ? page.nextCursor : undefined),
    retry: false,
  });
  const submission = useMutation({
    mutationFn: (payload) => createExchangeOffer(saleId, payload),
    // 등록은 멱등 요청이 아니므로 네트워크 실패 시 자동 재전송하지 않는다.
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangeKeys.sent() });
    },
    onError: (error) => {
      const isSaleUnavailable =
        (error.status === 409 &&
          (error.code === "SALE_SOLD_OUT" || error.code === "SALE_CANCELLED")) ||
        (error.status === 404 && error.code === "SALE_NOT_FOUND");

      if (isSaleUnavailable) onSaleUnavailable?.();

      if (error.status === 409 || isSaleUnavailable) {
        queryClient.invalidateQueries({ queryKey: galleryKeys.all });
        queryClient.invalidateQueries({ queryKey: marketKeys.detail(saleId) });
        queryClient.invalidateQueries({ queryKey: exchangeKeys.sent() });
      }
    },
  });

  async function handleSubmit(payload) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      const offer = await submission.mutateAsync(payload);
      onSuccess(offer);
    } catch {
      // 판매 종료는 상위 화면에서 안내하고, 그 외 실패는 입력값과 재시도 흐름을 유지한다.
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <ExchangeModal
      ownerships={ownerships.data?.pages.flatMap((page) => page.items) ?? []}
      filters={filters}
      onFiltersChange={setFilters}
      isLoading={ownerships.isPending}
      listErrorMessage={ownerships.error?.message ?? ""}
      hasNextPage={!ownerships.isError && ownerships.hasNextPage}
      isFetchingNextPage={ownerships.isFetchingNextPage}
      onLoadMore={() => {
        if (
          ownerships.hasNextPage &&
          !ownerships.isFetching &&
          !ownerships.isError
        ) {
          ownerships.fetchNextPage();
        }
      }}
      isSubmitting={submission.isPending}
      errorMessage={submission.error?.message ?? ""}
      onResetError={submission.reset}
      onSubmit={handleSubmit}
      onClose={() => {
        if (!submittingRef.current) onClose();
      }}
    />
  );
}
