"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import useSaleDetail from "../../hooks/use-sale-detail";
import ExchangePreference from "../ExchangePreference/ExchangePreference";
import ExchangeOfferSection from "../ExchangeOfferSection/ExchangeOfferSection";
import PurchaseSection from "../PurchaseSection/PurchaseSection";
import SaleCardOverview from "../SaleCardOverview/SaleCardOverview";
import SellerSaleSection from "../SellerSaleSection/SellerSaleSection";
import styles from "./SaleDetailPage.module.css";

const EXCHANGE_MODAL_TEXT = {
  accept: {
    title: "교환 제시 승인",
    confirmText: "승인하기",
    actionText: "승인",
  },
  reject: {
    title: "교환 제시 거절",
    confirmText: "거절하기",
    actionText: "거절",
  },
};

export default function SaleDetailPage({ saleId }) {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [exchangeAction, setExchangeAction] = useState(null);

  const { data: sale, isPending, isError, error } = useSaleDetail(saleId);

  if (isPending) {
    return <main className={styles.state}>판매 정보를 불러오는 중입니다.</main>;
  }

  if (isError) {
    return (
      <main className={styles.state} role="alert">
        {error?.message ?? "판매 정보를 불러오지 못했습니다."}
      </main>
    );
  }

  const isOwner = sale.isOwner === true;

  const handleAccept = (exchangeOffer) => {
    setSelectedOffer(exchangeOffer);
    setExchangeAction("accept");
  };

  const handleReject = (exchangeOffer) => {
    setSelectedOffer(exchangeOffer);
    setExchangeAction("reject");
  };

  const modalText = EXCHANGE_MODAL_TEXT[exchangeAction];

  const cardGrade =
    typeof selectedOffer?.offeredCard?.grade === "string"
      ? selectedOffer.offeredCard.grade.trim()
      : "";

  const cardName =
    typeof selectedOffer?.offeredCard?.name === "string"
      ? selectedOffer.offeredCard.name.trim()
      : "";

  const hasCardInfo = Boolean(cardGrade || cardName);

  const modalMessage =
    selectedOffer && modalText ? (
      <>
        {hasCardInfo && (
          <>
            [{cardGrade || "-"} | {cardName || "-"}]
            <br />
          </>
        )}
        카드와의 교환을 {modalText.actionText}하시겠습니까?
      </>
    ) : null;

  return (
    <main className={styles.main}>
      <SaleCardOverview sale={sale}>
        {isOwner ? (
          <SellerSaleSection sale={sale} />
        ) : (
          <div className={styles.actions}>
            <PurchaseSection sale={sale} />
          </div>
        )}
      </SaleCardOverview>

      {!isOwner && <ExchangePreference variant="full" />}

      {isOwner && (
        <ExchangeOfferSection
          saleId={saleId}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {selectedOffer && exchangeAction && modalText && (
        <Modal
          title={modalText.title}
          message={modalMessage}
          confirmText={modalText.confirmText}
          onConfirm={() => {}}
          onClose={() => {
            setSelectedOffer(null);
            setExchangeAction(null);
          }}
        />
      )}
    </main>
  );
}
