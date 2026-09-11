"use client";

import { useId } from "react";
import Button from "@/components/common/Button/Button";
import OwnedExchangeCard from "./OwnedExchangeCard";
import styles from "./ExchangeModal.module.css";

export default function ExchangeOfferForm({
  ownership,
  description,
  onDescriptionChange,
  onBack,
  onSubmit,
  isSubmitting = false,
}) {
  const descriptionId = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting || ownership.quantity < 1) return;

  
    onSubmit?.({ offeredCardId: ownership.photoCard.id }, { description });
  };

  return (
    <div className={styles.offerLayout}>
      <OwnedExchangeCard ownership={ownership} />
      <form className={styles.offerForm} onSubmit={handleSubmit}>
        <label htmlFor={descriptionId} className={styles.label}>
          교환 제시 내용
        </label>
        <textarea
          id={descriptionId}
          className={styles.description}
          placeholder="교환 제시 내용을 입력해 주세요"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
        <div className={styles.actions}>
          <Button variant="secondary" size="lg" onClick={onBack}>
            뒤로가기
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || ownership.quantity < 1 || !onSubmit}
          >
            교환하기
          </Button>
        </div>
      </form>
    </div>
  );
}
