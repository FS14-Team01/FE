"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/ToastProvider";
import {
  getCardCategoryLabel,
  getCardGradeLabel,
} from "@/constants/marketplace-options";
import { getAccessToken } from "@/lib/auth-token";
import { marketKeys } from "@/lib/query-keys";
import ExchangeRequestModal from "../ExchangeModal/ExchangeRequestModal";
import RequesterExchangeOfferSection from "../RequesterExchangeOfferSection/RequesterExchangeOfferSection";
import styles from "./RequesterExchangeSection.module.css";

export default function RequesterExchangeSection({ saleId, sale, saleError }) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [isSaleUnavailable, setIsSaleUnavailable] = useState(false);
  const titleId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 상세 재조회 오류도 상위에서 전달받아 추가 요청 없이 교환 중 판매 종료를 안내한다.
  const isExchangeSaleUnavailable =
    isSaleUnavailable ||
    (isRequestModalOpen &&
      (sale.status === "SOLD_OUT" ||
        sale.status === "CANCELLED" ||
        (saleError?.status === 404 && saleError.code === "SALE_NOT_FOUND")));

  const handleLeaveUnavailableSale = () => {
    queryClient.invalidateQueries({ queryKey: marketKeys.lists() });
    router.replace("/marketplace");
  };

  const handleOpenRequest = () => {
    if (!getAccessToken()) {
      setIsLoginRequiredOpen(true);
      return;
    }
    setIsRequestModalOpen(true);
  };

  if (isExchangeSaleUnavailable) {
    return (
      <Modal
        title="교환 불가 안내"
        message="판매가 종료되었거나 더 이상 이용할 수 없어 교환을 제안할 수 없습니다."
        confirmText="마켓플레이스로 이동"
        onConfirm={handleLeaveUnavailableSale}
        onClose={handleLeaveUnavailableSale}
      />
    );
  }

  // 일반 상세 조회 오류 UI는 상위 페이지가 담당한다.
  if (saleError) return null;

  return (
    <>
      <section className={styles.section} aria-labelledby={titleId}>
        <h2 id={titleId} className={styles.title}>
          교환 희망 정보
        </h2>

        <div className={styles.content}>
          {sale.desiredDescription && (
            <p className={styles.description}>{sale.desiredDescription}</p>
          )}
          {(sale.desiredGrade || sale.desiredCategory) && (
            <div className={styles.meta}>
              {sale.desiredGrade && (
                <strong data-grade={sale.desiredGrade}>
                  {getCardGradeLabel(sale.desiredGrade)}
                </strong>
              )}
              {sale.desiredGrade && sale.desiredCategory && (
                <span className={styles.separator} aria-hidden="true">
                  |
                </span>
              )}
              {sale.desiredCategory && (
                <span>{getCardCategoryLabel(sale.desiredCategory)}</span>
              )}
            </div>
          )}
        </div>
        <Button
          className={styles.exchangeButton}
          size="lg"
          onClick={handleOpenRequest}
          disabled={sale.status !== "ON_SALE" || sale.remainingQuantity < 1}
        >
          포토카드 교환하기
        </Button>
      </section>

      <RequesterExchangeOfferSection saleId={saleId} />

      {isLoginRequiredOpen && (
        <Modal
          title="로그인이 필요합니다."
          message={
            <>
              로그인 하시겠습니까?
              <br />
              다양한 서비스를 편리하게 이용하실 수 있습니다.
            </>
          }
          confirmText="확인"
          onConfirm={() => router.push("/login")}
          onClose={() => setIsLoginRequiredOpen(false)}
        />
      )}

      {isRequestModalOpen && (
        <ExchangeRequestModal
          saleId={saleId}
          onClose={() => setIsRequestModalOpen(false)}
          onSaleUnavailable={() => {
            setIsSaleUnavailable(true);
            setIsRequestModalOpen(false);
          }}
          onSuccess={() => {
            setIsRequestModalOpen(false);
            showToast({ status: "success", action: "exchange" });
          }}
        />
      )}
    </>
  );
}
