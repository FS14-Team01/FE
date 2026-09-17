"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { getCardGradeLabel } from "@/constants/marketplace-options";
import {
  exchangeKeys,
  marketKeys,
  galleryKeys,
  saleKeys,
} from "@/lib/query-keys";
import useSaleDetail from "../../hooks/use-sale-detail";
import useUpdateExchangeOfferStatus from "../../hooks/use-update-exchange-offer-status.js";
import RequesterExchangeSection from "../RequesterExchangeSection/RequesterExchangeSection";
import ExchangeOfferSection from "../ExchangeOfferSection/ExchangeOfferSection";
import PurchaseSection from "../PurchaseSection/PurchaseSection";
import SaleCardOverview from "../SaleCardOverview/SaleCardOverview";
import SellerSaleSection from "../SellerSaleSection/SellerSaleSection";
import styles from "./SaleDetailPage.module.css";

// query key 정책에 따라 limit은 queryKey filter에 포함하고 목록 노출 개수는 페이지 정책으로 관리
const PAGE_SIZE = 12;

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
// UI 액션값은 accept/reject로 관리하고 API요청시 명세 status 값으로 변환
const EXCHANGE_STATUS_BY_ACTION = {
  accept: "ACCEPTED",
  reject: "REJECTED",
};

const TOAST_ACTION_BY_EXCHANGE_ACTION = {
  accept: "exchangeAccept",
  reject: "exchangeReject",
};

export default function SaleDetailPage({ saleId }) {
  const router = useRouter();

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [exchangeAction, setExchangeAction] = useState(null);
  // 구매 성공 모달은 상세 재조회/품절 전환과 무관하게 유지되어야 하므로
  // PurchaseSection이 아니라 여기서 구매 시점 스냅샷으로 관리한다
  const [purchaseResult, setPurchaseResult] = useState(null);

  const {
    data: sale,
    isPending,
    isFetching,
    isError,
    error,
  } = useSaleDetail(saleId);

  const {
    mutate: updateExchangeOfferStatus,
    isPending: isUpdatingExchangeOffer,
  } = useUpdateExchangeOfferStatus();

  const { showToast } = useToast();

  const queryClient = useQueryClient();

  const isLoading = isPending || isFetching;
  const isUnavailable =
    !isLoading &&
    !isError &&
    (sale?.status === "SOLD_OUT" || sale?.status === "CANCELLED");
  const isOwner = sale?.isOwner === true;

  const handleAccept = (exchangeOffer) => {
    setSelectedOffer(exchangeOffer);
    setExchangeAction("accept");
  };

  const handleReject = (exchangeOffer) => {
    setSelectedOffer(exchangeOffer);
    setExchangeAction("reject");
  };

  const modalText = EXCHANGE_MODAL_TEXT[exchangeAction];
  const exchangeStatus = EXCHANGE_STATUS_BY_ACTION[exchangeAction];
  const toastAction = TOAST_ACTION_BY_EXCHANGE_ACTION[exchangeAction];

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

  const handleConfirmExchange = () => {
    if (
      !selectedOffer?.id ||
      !exchangeStatus ||
      !toastAction ||
      isUpdatingExchangeOffer
    )
      return;

    updateExchangeOfferStatus(
      {
        exchangeOfferId: selectedOffer.id,
        status: exchangeStatus,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: exchangeKeys.receivedBySale(saleId, { limit: PAGE_SIZE }),
          });

          // 교환 승인 시 판매 상세/마켓플레이스/마이갤러리 데이터가 변경되므로 관련 캐시 갱신
          if (exchangeAction === "accept") {
            queryClient.invalidateQueries({
              queryKey: marketKeys.detail(saleId),
            });

            queryClient.invalidateQueries({
              queryKey: marketKeys.lists(),
            });

            queryClient.invalidateQueries({
              queryKey: galleryKeys.lists(),
            });

            queryClient.invalidateQueries({
              queryKey: saleKeys.all,
            });
          }

          showToast({ status: "success", action: toastAction });

          setSelectedOffer(null);
          setExchangeAction(null);

          if (exchangeAction === "accept") {
            router.push("/my-gallery");
          }
        },
        onError: () => {
          showToast({ status: "failure", action: toastAction });

          setSelectedOffer(null);
          setExchangeAction(null);
        },
      },
    );
  };

  // 구매 성공 모달은 아래 분기 바깥에서 렌더하므로 상세가 숨겨져도 유지된다
  const handleClosePurchaseResult = () => {
    setPurchaseResult(null);
  };

  let pageContent;

  if (isLoading) {
    pageContent = (
      <main className={styles.state}>판매 정보를 불러오는 중입니다.</main>
    );
  } else if (isError) {
    pageContent = (
      <main className={styles.state} role="alert">
        {error?.message ?? "판매 정보를 불러오지 못했습니다."}
        {sale && !sale.isOwner && (
          <RequesterExchangeSection
            key={saleId}
            saleId={saleId}
            sale={sale}
            saleError={error}
          />
        )}
      </main>
    );
  } else if (isUnavailable) {
    pageContent = (
      <main className={styles.state} role="alert">
        판매 정보를 찾을 수 없습니다.
      </main>
    );
  } else {
    pageContent = (
      <main className={styles.main}>
        <SaleCardOverview sale={sale}>
          {isOwner ? (
            <SellerSaleSection sale={sale} />
          ) : (
            <div className={styles.actions}>
              <PurchaseSection
                sale={sale}
                onPurchaseSuccess={setPurchaseResult}
              />
            </div>
          )}
        </SaleCardOverview>

        {!isOwner && (
          <RequesterExchangeSection key={saleId} saleId={saleId} sale={sale} />
        )}

        {isOwner && (
          <ExchangeOfferSection
            saleId={saleId}
            pageSize={PAGE_SIZE}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}

        {selectedOffer && exchangeAction && modalText && (
          <Modal
            title={modalText.title}
            message={modalMessage}
            confirmText={modalText.confirmText}
            onConfirm={handleConfirmExchange}
            onClose={() => {
              setSelectedOffer(null);
              setExchangeAction(null);
            }}
            isPending={isUpdatingExchangeOffer}
          />
        )}
      </main>
    );
  }

  return (
    <>
      {pageContent}

      {/* 상세가 로딩/오류/품절로 전환되어도 구매 결과 안내는 남는다 */}
      {purchaseResult && (
        <div className={styles.successModal}>
          <Modal
            title="구매 성공"
            message={`[${getCardGradeLabel(purchaseResult.grade)} | ${purchaseResult.cardName}] ${purchaseResult.quantity}장 구매에 성공했습니다!`}
            confirmText="마이갤러리에서 확인하기"
            onConfirm={() => router.push("/my-gallery")}
            onClose={handleClosePurchaseResult}
          />
        </div>
      )}
    </>
  );
}
