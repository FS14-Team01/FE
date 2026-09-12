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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useExchangeOffers(saleId, pageSize);

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

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
        {isPending && <p>교환 제시 목록을 불러오는 중입니다.</p>}

        {isInitialError && (
          <p role="alert">
            {error?.message ?? "교환 제시 목록을 불러오지 못했습니다."}
          </p>
        )}

        {!isPending && !isInitialError && exchangeOffers.length === 0 && (
          <p>아직 받은 교환 제안이 없습니다.</p>
        )}

        {/* 상위에서 이미 분기가 끝난 "seller"결과를 명시 */}
        {!isPending &&
          !isInitialError &&
          exchangeOffers.map((exchangeOffer) => (
            <ExchangeCard
              key={exchangeOffer.id}
              viewerRole="seller"
              exchangeOffer={exchangeOffer}
              onAccept={() => onAccept(exchangeOffer)}
              onReject={() => onReject(exchangeOffer)}
            />
          ))}

        {hasNextPage && <div ref={loadMoreRef} />}

        {isFetchingNextPage && <p>교환 제시 목록을 더 불러오는 중입니다.</p>}

        {isFetchNextPageError && (
          <div>
            <p role="alert">교환 제시 목록을 추가로 불러오지 못했습니다.</p>

            <button type="button" onClick={() => fetchNextPage()}>
              다시 시도
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
