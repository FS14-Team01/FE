"use client";

import { useEffect, useRef } from "react";
import ExchangeCard from "@/features/marketplace/components/ExchangeCard/ExchangeCard";
import useExchangeOffers from "@/features/marketplace/hooks/use-exchange-offers";
import styles from "./ExchangeOfferSection.module.css";

export default function ExchangeOfferSection({
  saleId,
  pageSize,
  onAccept,
  onReject,
}) {
  const {
    data: exchangeOfferData,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useExchangeOffers(saleId, pageSize);

  // 비인증 사용자는 판매 상세 페이지 진입 단계에서 차단
  // 상세 진입 후 교환 목록 조회 중 발생한 오류는 별도 인증 UI로 분기하지 않고
  // 일반 초기 조회 오류로 처리해 다시 시도할 수 있도록 함
  const isInitialError = isError && !isFetchNextPageError;

  const exchangeOffers =
    exchangeOfferData?.pages.flatMap((page) => page.items) ?? [];

  // DOM 요소를 직접 참조할 수 있게 연결
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const loadMoreTarget = loadMoreRef.current;

    // 중복 요청 방지
    if (
      !loadMoreTarget ||
      !hasNextPage ||
      isFetching ||
      isFetchingNextPage ||
      isFetchNextPageError
    )
      return;

    // 브라우저 Web API: 특정 DOM 요소가 화면에 들어왔는지 감지
    const loadMoreObserver = new IntersectionObserver(([loadMoreEntry]) => {
      if (!loadMoreEntry.isIntersecting) return;

      loadMoreObserver.unobserve(loadMoreTarget);
      fetchNextPage();
    });

    loadMoreObserver.observe(loadMoreTarget);

    return () => loadMoreObserver.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  ]);

  return (
    <section
      className={styles.section}
      aria-labelledby="exchange-offer-heading"
      data-sale-id={saleId}
    >
      <div className={styles.heading}>
        <h2 id="exchange-offer-heading" className={styles.title}>
          교환 제시 목록
        </h2>
      </div>

      <div className={styles.content}>
        {isPending && (
          <p className={styles.statusMessage}>
            교환 제시 목록을 불러오는 중입니다.
          </p>
        )}

        {isInitialError && (
          <div className={styles.statusContainer}>
            <p className={styles.statusMessage} role="alert">
              {error?.message ?? "교환 제시 목록을 불러오지 못했습니다."}
            </p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              다시 시도
            </button>
          </div>
        )}

        {!isPending && !isInitialError && exchangeOffers.length === 0 && (
          <p className={styles.statusMessage}>
            아직 받은 교환 제안이 없습니다.
          </p>
        )}

        {/* 상위에서 이미 분기가 끝난 "seller" 결과를 명시 */}
        {!isPending && !isInitialError && exchangeOffers.length > 0 && (
          <div className={styles.cardList}>
            {exchangeOffers.map((exchangeOffer) => (
              <ExchangeCard
                key={exchangeOffer.id}
                viewerRole="seller"
                exchangeOffer={exchangeOffer}
                onAccept={() => onAccept(exchangeOffer)}
                onReject={() => onReject(exchangeOffer)}
              />
            ))}
          </div>
        )}

        {!isPending &&
          !isInitialError &&
          !isFetchNextPageError &&
          hasNextPage && <div ref={loadMoreRef} />}

        {isFetchingNextPage && (
          <p className={styles.statusMessage}>
            교환 제시 목록을 더 불러오는 중입니다.
          </p>
        )}

        {isFetchNextPageError && (
          <div className={styles.statusContainer}>
            <p className={styles.statusMessage} role="alert">
              교환 제시 목록을 추가로 불러오지 못했습니다.
            </p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
