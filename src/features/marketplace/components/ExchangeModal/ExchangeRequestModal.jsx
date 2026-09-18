"use client";

import { useCallback, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { exchangeKeys, galleryKeys, marketKeys } from "@/lib/query-keys";
import Toast from "@/components/common/Toast/Toast";
import { useToast } from "@/components/common/Toast/ToastProvider";
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
  const [failureToastId, setFailureToastId] = useState(0);
  const closeFailureToast = useCallback(() => setFailureToastId(0), []);
  const { showToast } = useToast();
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

      if (isSaleUnavailable) {
        showToast({ status: "failure", action: "exchange" });
        onSaleUnavailable?.();
      } else {
        setFailureToastId((previous) => previous + 1);
      }

      if (error.status === 409 || isSaleUnavailable) {
        queryClient.invalidateQueries({ queryKey: galleryKeys.all });
        // 판매 종료가 아닌 요청 실패는 모달과 입력값을 유지하며 안내한다.
        // 상세 재조회는 부모의 로딩 화면 전환으로 모달을 닫을 수 있어 판매 종료 때만 한다.
        if (isSaleUnavailable) {
          queryClient.invalidateQueries({ queryKey: marketKeys.detail(saleId) });
        }
        queryClient.invalidateQueries({ queryKey: exchangeKeys.sent() });
      }
    },
  });

  async function handleSubmit(payload) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    closeFailureToast();
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
      listErrorMessage={
        ownerships.isError
          ? ownerships.error?.status === 401
            ? "보유 카드를 불러오지 못했습니다."
            : (ownerships.error?.message ?? "보유 카드를 불러오지 못했습니다.")
          : ""
      }
      isRetryingList={ownerships.isFetching}
      onRetryList={() => {
        if (ownerships.isFetching) return;
        if (ownerships.isFetchNextPageError) ownerships.fetchNextPage();
        else ownerships.refetch();
      }}
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
      canRetrySubmit={
        submission.isError &&
        (submission.error?.status === 0 || submission.error?.status >= 500)
      }
      errorMessage={submission.error?.message ?? ""}
      onResetError={() => {
        submission.reset();
        closeFailureToast();
      }}
      feedback={
        failureToastId > 0 && (
          <Toast
            key={failureToastId}
            status="failure"
            action="exchange"
            onClose={closeFailureToast}
          />
        )
      }
      onSubmit={handleSubmit}
      onClose={() => {
        if (!submittingRef.current) onClose();
      }}
    />
  );
}
