"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { getCardGradeLabel } from "@/constants/marketplace-options";
import usePurchaseSale from "../../hooks/use-purchase-sale";
import styles from "./PurchaseSection.module.css";

const MIN_QUANTITY = 1;

// TODO: 다른 화면과 중복 정의라 공통 유틸로 분리 필요
function formatPoints(points) {
  return `${new Intl.NumberFormat("ko-KR").format(points)} P`;
}

export default function PurchaseSection({ sale, onPurchaseSuccess }) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { showToast } = useToast();
  const purchaseMutation = usePurchaseSale(sale.id);

  const isSoldOut = sale.status !== "ON_SALE" || sale.remainingQuantity === 0;

  // 선택 후 재고가 줄어들 수 있어 표시 시점에 잔여 수량으로 다시 제한한다
  const maxQuantity = Math.max(MIN_QUANTITY, sale.remainingQuantity);
  const selectedQuantity = Math.min(quantity, maxQuantity);
  const totalPrice = sale.price * selectedQuantity;

  const handleDecrease = () => {
    setQuantity(Math.max(MIN_QUANTITY, selectedQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity(Math.min(maxQuantity, selectedQuantity + 1));
  };

  const handleConfirmPurchase = () => {
    purchaseMutation.mutate(selectedQuantity, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        onPurchaseSuccess?.();
      },
      onError: () => {
        setIsConfirmOpen(false);
        showToast({
          status: "failure",
          action: "purchase",
        });
      },
    });
  };

  return (
    <section
      className={styles.section}
      aria-label="포토카드 구매"
      data-sale-id={sale.id}
    >
      <div className={styles.quantityRow}>
        <span className={styles.label}>구매수량</span>

        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={handleDecrease}
            disabled={isSoldOut || selectedQuantity <= MIN_QUANTITY}
            aria-label="구매수량 감소"
          >
            −
          </button>
          <span className={styles.stepperValue}>{selectedQuantity}</span>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={handleIncrease}
            disabled={isSoldOut || selectedQuantity >= maxQuantity}
            aria-label="구매수량 증가"
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.priceRow}>
        <span className={styles.label}>총 가격</span>
        <span className={styles.totalPrice}>
          {formatPoints(totalPrice)}{" "}
          <span className={styles.quantityHint}>({selectedQuantity}장)</span>
        </span>
      </div>

      <button
        type="button"
        className={styles.purchaseButton}
        onClick={() => setIsConfirmOpen(true)}
        disabled={isSoldOut}
      >
        포토카드 구매하기
      </button>

      {isConfirmOpen && (
        <Modal
          title="포토카드 구매"
          message={`[${getCardGradeLabel(sale.photoCard.grade)} | ${sale.photoCard.name}] ${selectedQuantity}장을 구매하시겠습니까?`}
          confirmText="구매하기"
          onConfirm={handleConfirmPurchase}
          onClose={() => setIsConfirmOpen(false)}
          isPending={purchaseMutation.isPending}
        />
      )}
    </section>
  );
}
