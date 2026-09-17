"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/common/Button/Button";
import { useToast } from "@/components/common/Toast/ToastProvider";
import useRequesterExchangeOffers from "../../hooks/use-requester-exchange-offers";
import ExchangeCard from "../ExchangeCard/ExchangeCard";
import styles from "./RequesterExchangeOfferSection.module.css";

export default function RequesterExchangeOfferSection({ saleId, requesterId }) {
  const { offers, cancellation, cancel } = useRequesterExchangeOffers({
    saleId,
    requesterId,
  });
  const { showToast } = useToast();
  const sentinelRef = useRef(null);
  const { hasNextPage, isFetching, isError, error, fetchNextPage } = offers;
  const isCancelling = cancellation.isPending;
  const errorMessage =
    error?.status === 401
      ? "교환 제시 목록을 불러오지 못했습니다."
      : error?.message ?? "교환 제시 목록을 불러오지 못했습니다.";

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetching || isError || isCancelling)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          fetchNextPage();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, isError, isCancelling, fetchNextPage]);

  const items = offers.data?.pages.flatMap((page) => page.items) ?? [];
  async function handleCancel({ exchangeOfferId }) {
    if (await cancel(exchangeOfferId)) {
      showToast({ status: "info", message: "교환 제안을 취소했습니다." });
    }
  }

  return (
    <section
      className={styles.section}
      aria-label="내가 보낸 교환 제안"
      data-sale-id={saleId}
    >
      {offers.isPending && (
        <p className={styles.message} role="status">
          교환 제안 목록을 불러오는 중입니다.
        </p>
      )}
      {offers.isError && (
        <div className={styles.feedback}>
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
          <Button
            variant="secondary"
            size="sm"
            disabled={offers.isFetching}
            onClick={() =>
              offers.isFetchNextPageError
                ? offers.fetchNextPage()
                : offers.refetch()
            }
          >
            다시 불러오기
          </Button>
        </div>
      )}
      {cancellation.isError && (
        <p className={styles.error} role="alert">
          {cancellation.error.message}
        </p>
      )}
      {!offers.isPending && !offers.isError && items.length === 0 && (
        <p className={styles.message}>이 판매글에 보낸 교환 제안이 없습니다.</p>
      )}
      <div className={styles.grid}>
        {items.map((offer) => (
          <ExchangeCard
            key={offer.id}
            viewerRole="requester"
            exchangeOffer={{
              ...offer,
              offeredCard: {
                ...offer.offeredCard,
                description: offer.offeredDescription,
              },
            }}
            onCancel={isCancelling ? undefined : handleCancel}
          />
        ))}
      </div>
      {offers.isFetchingNextPage && (
        <p className={styles.message} role="status">
          교환 제안을 더 불러오는 중입니다.
        </p>
      )}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
    </section>
  );
}
