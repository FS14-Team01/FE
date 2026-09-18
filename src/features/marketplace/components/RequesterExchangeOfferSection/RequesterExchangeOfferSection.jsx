"use client";

import { useEffect, useId, useRef, useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { getCardGradeLabel } from "@/constants/marketplace-options";
import useRequesterExchangeOffers from "../../hooks/use-requester-exchange-offers";
import ExchangeCard from "../ExchangeCard/ExchangeCard";
import ExchangeListStatus from "../ExchangeModal/ExchangeListStatus";
import styles from "./RequesterExchangeOfferSection.module.css";

export default function RequesterExchangeOfferSection({ saleId, requesterId }) {
  const { offers, cancellation, cancel } = useRequesterExchangeOffers({
    saleId,
    requesterId,
  });
  const { showToast } = useToast();
  const titleId = useId();
  const [selectedOffer, setSelectedOffer] = useState(null);
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
  function handleOpenCancel(offer) {
    cancellation.reset();
    setSelectedOffer(offer);
  }

  function handleCloseCancel() {
    if (isCancelling) return;
    setSelectedOffer(null);
    cancellation.reset();
  }

  async function handleConfirmCancel() {
    if (!selectedOffer || isCancelling) return;
    if (await cancel(selectedOffer.id)) {
      setSelectedOffer(null);
      showToast({ status: "info", message: "교환 제안을 취소했습니다." });
    }
  }

  return (
    <section
      className={styles.section}
      aria-labelledby={titleId}
      data-sale-id={saleId}
    >
      <div className={styles.heading}>
        <h2 id={titleId} className={styles.title}>
          내가 제시한 교환 목록
        </h2>
      </div>

      <div className={styles.content}>
        {offers.isPending && (
          <ExchangeListStatus message="교환 제안 목록을 불러오는 중입니다." />
        )}
        {!offers.isPending && !offers.isError && items.length === 0 && (
          <ExchangeListStatus message="이 판매글에 보낸 교환 제안이 없습니다." />
        )}

        {items.length > 0 && (
          <div className={styles.grid}>
            {items.map((offer) => (
              <ExchangeCard
                key={offer.id}
                viewerRole="requester"
                exchangeOffer={offer}
                onCancel={
                  isCancelling ? undefined : () => handleOpenCancel(offer)
                }
              />
            ))}
          </div>
        )}

        {offers.isFetchingNextPage && (
          <ExchangeListStatus message="교환 제안을 더 불러오는 중입니다." />
        )}
        {/* 추가 조회 실패 시 기존 카드를 유지하고 목록 끝에서 재시도한다. */}
        {offers.isError && (
          <ExchangeListStatus
            message={errorMessage}
            isError
            isRetrying={offers.isFetching}
            onRetry={() =>
              offers.isFetchNextPageError
                ? offers.fetchNextPage()
                : offers.refetch()
            }
          />
        )}
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      </div>

      {selectedOffer && (
        <Modal
          title="교환 제시 취소"
          message={
            <>
              [{getCardGradeLabel(selectedOffer.offeredCard.grade)} |{" "}
              {selectedOffer.offeredCard.name}]{" "}
              <br className={styles.cancelLineBreak} />
              교환 제시를 취소하시겠습니까?
              {cancellation.isError && (
                <span className={styles.cancelError} role="alert">
                  {cancellation.error?.status === 401
                    ? "교환 제안을 취소하지 못했습니다."
                    : (cancellation.error?.message ??
                      "교환 제안을 취소하지 못했습니다.")}
                </span>
              )}
            </>
          }
          confirmText={cancellation.isError ? "다시 시도" : "취소하기"}
          isPending={isCancelling}
          onConfirm={handleConfirmCancel}
          onClose={handleCloseCancel}
        />
      )}
    </section>
  );
}
