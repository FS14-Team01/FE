"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import {
  CARD_CATEGORY_OPTIONS,
  CARD_GRADE_OPTIONS,
  getCardCategoryLabel,
  getCardGradeLabel,
} from "@/constants/marketplace-options";
import styles from "./SaleEditModal.module.css";

const GRADE_CLASS_NAMES = {
  COMMON: "common",
  RARE: "rare",
  SUPER_RARE: "superRare",
  LEGENDARY: "legendary",
};

export default function SaleEditModal({
  sale,
  isSubmitting,
  onSubmit,
  onClose,
}) {
  const titleId = useId();
  const dragStartYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const soldQuantity = sale.initialQuantity - sale.remainingQuantity;
  const minimumQuantity = soldQuantity + 1;
  const maximumQuantity = sale.maxQuantity ?? sale.initialQuantity;
  const [quantity, setQuantity] = useState(sale.initialQuantity);
  const [price, setPrice] = useState(sale.price);
  const [desiredGrade, setDesiredGrade] = useState(sale.desiredGrade ?? "");
  const [desiredCategory, setDesiredCategory] = useState(
    sale.desiredCategory ?? "",
  );
  const [desiredDescription, setDesiredDescription] = useState(
    sale.desiredDescription ?? "",
  );
  const gradeClassName = GRADE_CLASS_NAMES[sale.photoCard.grade];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleQuantityChange = (nextQuantity) => {
    setQuantity(
      Math.min(maximumQuantity, Math.max(minimumQuantity, nextQuantity)),
    );
  };

  const handleDragStart = (event) => {
    if (isSubmitting) return;

    dragStartYRef.current = event.clientY;
    isDraggingRef.current = true;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event) => {
    if (!isDraggingRef.current) return;
    setDragOffset(Math.max(0, event.clientY - dragStartYRef.current));
  };

  const handleDragEnd = (event) => {
    if (!isDraggingRef.current) return;

    const finalOffset = Math.max(0, event.clientY - dragStartYRef.current);
    isDraggingRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (finalOffset >= 120) {
      onClose();
      return;
    }

    setDragOffset(0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      quantity,
      price,
      desiredGrade: desiredGrade || null,
      desiredCategory: desiredCategory || null,
      desiredDescription: desiredDescription.trim() || null,
    });
  };

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={`${styles.modal} ${isDragging ? styles.dragging : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ transform: `translateY(${dragOffset}px)` }}
      >
        <button
          className={styles.dragHandle}
          type="button"
          aria-label="아래로 밀어서 수정 모달 닫기"
          disabled={isSubmitting}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        />

        <button
          className={styles.closeButton}
          type="button"
          aria-label="수정 모달 닫기"
          disabled={isSubmitting}
          onClick={onClose}
        >
          <Image src="/assets/ic_close.svg" alt="" width={32} height={32} />
        </button>

        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.eyebrow}>수정하기</p>
          <h2 id={titleId} className={styles.title}>
            {sale.photoCard.name}
          </h2>

          <div className={styles.cardInformation}>
            <div
              className={styles.cardImage}
              role="img"
              aria-label={`${sale.photoCard.name} 포토카드`}
              style={{ backgroundImage: `url(${sale.photoCard.imageUrl})` }}
            />

            <div className={styles.saleFields}>
              <div className={styles.cardMeta}>
                <strong className={styles[gradeClassName] ?? ""}>
                  {getCardGradeLabel(sale.photoCard.grade)}
                </strong>
                <span>{getCardCategoryLabel(sale.photoCard.category)}</span>
                <span>{sale.seller.nickname}</span>
              </div>

              <label className={styles.fieldRow}>
                <span>총 판매 수량</span>
                <span className={styles.quantityField}>
                  <span className={styles.quantityControl}>
                    <button
                      type="button"
                      disabled={isSubmitting || quantity <= minimumQuantity}
                      onClick={() => handleQuantityChange(quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={minimumQuantity}
                      max={maximumQuantity}
                      value={quantity}
                      disabled={isSubmitting}
                      onChange={(event) =>
                        handleQuantityChange(Number(event.target.value))
                      }
                    />
                    <button
                      type="button"
                      disabled={isSubmitting || quantity >= maximumQuantity}
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      +
                    </button>
                  </span>
                  <span className={styles.maximumQuantity}>
                    <strong>/ {maximumQuantity}</strong>
                    <small>최대 {maximumQuantity}장</small>
                  </span>
                </span>
              </label>

              <label className={styles.fieldRow}>
                <span>장당 가격</span>
                <span className={styles.priceControl}>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={price}
                    disabled={isSubmitting}
                    onChange={(event) => setPrice(Number(event.target.value))}
                  />
                  <span>P</span>
                </span>
              </label>
            </div>
          </div>

          <fieldset className={styles.preferenceFields}>
            <legend>교환 희망 정보</legend>
            <div className={styles.dropdownFields}>
              <label>
                <span>등급</span>
                <Dropdown
                  className={styles.dropdown}
                  variant="sort"
                  options={CARD_GRADE_OPTIONS}
                  value={desiredGrade}
                  onChange={setDesiredGrade}
                  placeholder="등급 선택"
                  label="교환 희망 등급"
                />
              </label>
              <label>
                <span>장르</span>
                <Dropdown
                  className={styles.dropdown}
                  variant="sort"
                  options={CARD_CATEGORY_OPTIONS}
                  value={desiredCategory}
                  onChange={setDesiredCategory}
                  placeholder="장르 선택"
                  label="교환 희망 장르"
                />
              </label>
            </div>

            <label className={styles.descriptionField}>
              <span>교환 희망 설명</span>
              <textarea
                value={desiredDescription}
                disabled={isSubmitting}
                placeholder="교환 희망 내용을 입력해 주세요."
                onChange={(event) => setDesiredDescription(event.target.value)}
              />
            </label>
          </fieldset>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
            >
              취소하기
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
