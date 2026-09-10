"use client";

import ExchangeCard from "@/features/marketplace/components/ExchangeCard/ExchangeCard";
import useExchangeOffers from "@/features/marketplace/hooks/use-exchange-offers";
import styles from "./ExchangeOfferSection.module.css";

export default function ExchangeOfferSection({ saleId, onAccept, onReject }) {
  const {
    data: exchangeOfferData,
    isPending,
    isError,
    error,
  } = useExchangeOffers(saleId);

  const exchangeOffers = Array.isArray(exchangeOfferData)
    ? exchangeOfferData
    : (exchangeOfferData?.items ?? []);

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
        {isPending && <p>교환 제안 목록을 불러오는 중입니다.</p>}

        {isError && (
          <p role="alert">
            {error?.message ?? "교환 제안 목록을 불러오지 못했습니다."}
          </p>
        )}

        {!isPending && !isError && exchangeOffers.length === 0 && (
          <p>아직 받은 교환 제안이 없습니다.</p>
        )}

        {/* 상위에서 이미 분기가 끝난 "seller"결과를 명시 */}
        {!isPending &&
          !isError &&
          exchangeOffers.map((exchangeOffer) => (
            <ExchangeCard
              key={exchangeOffer.id}
              viewerRole="seller"
              exchangeOffer={exchangeOffer}
              onAccept={() => onAccept(exchangeOffer)}
              onReject={() => onReject(exchangeOffer)}
            />
          ))}
      </div>
    </section>
  );
}
