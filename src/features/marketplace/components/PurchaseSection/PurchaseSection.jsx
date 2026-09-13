"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal/Modal";
import { getCardGradeLabel } from "@/constants/marketplace-options";
import styles from "./PurchaseSection.module.css";

const MIN_QUANTITY = 1;

export default function PurchaseSection({ sale }) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [purchasedQuantity, setPurchasedQuantity] = useState(null);
  const router = useRouter();

  const isSoldOut = sale.status !== "ON_SALE" || sale.remainingQuantity === 0;
  const totalPrice = sale.price * quantity;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(MIN_QUANTITY, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(sale.remainingQuantity, prev + 1));
  };

  // TODO: POST /sales/:saleId/purchases 연동 후 실제 성공/실패로 교체
  const handleConfirmPurchase = () => {
    setIsConfirmOpen(false);
    setPurchasedQuantity(quantity);
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
            disabled={isSoldOut || quantity <= MIN_QUANTITY}
            aria-label="구매수량 감소"
          >
            −
          </button>
          <span className={styles.stepperValue}>{quantity}</span>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={handleIncrease}
            disabled={isSoldOut || quantity >= sale.remainingQuantity}
            aria-label="구매수량 증가"
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.priceRow}>
        <span className={styles.label}>총 가격</span>
        <span className={styles.totalPrice}>
          {totalPrice} P <span className={styles.quantityHint}>({quantity}장)</span>
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
          message={
            `[${getCardGradeLabel(sale.photoCard.grade)} | ${sale.photoCard.name}] ${quantity}장을 구매하시겠습니까?`
          }
          confirmText="구매하기"
          onConfirm={handleConfirmPurchase}
          onClose={() => setIsConfirmOpen(false)}
        />
      )}

      {purchasedQuantity !== null && (
        <div className={styles.successModal}>
          <Modal
            title="구매 성공"
            message={
              `[${getCardGradeLabel(sale.photoCard.grade)} | ${sale.photoCard.name}] ${purchasedQuantity}장 구매에 성공했습니다!`
            }
            confirmText="마이갤러리에서 확인하기"
            // TODO: 마이갤러리 라우트 경로 확정 후 수정
            onConfirm={() => router.push("/my-gallery")}
            onClose={() => setPurchasedQuantity(null)}
          />
        </div>
      )}
    </section>
  );
}
