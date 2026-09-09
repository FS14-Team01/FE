"use client";

import {
  getCardCategoryLabel,
  getCardGradeLabel,
  getExchangeStatusLabel,
} from "@/constants/marketplace-options";
import styles from "./ExchangeCard.module.css";

function normalizeEnum(value) {
  return String(value).trim().toUpperCase().replaceAll(" ", "_");
}

function getGradeClassName(grade) {
  return normalizeEnum(grade).toLowerCase();
}

function formatPoints(points) {
  return `${new Intl.NumberFormat("ko-KR").format(points)} P`;
}

function Divider() {
  return (
    <span className={styles.separator} aria-hidden="true">
      |
    </span>
  );
}

export default function ExchangeCard({
  viewerRole,
  exchangeOffer,
  isProcessing = false,
  errorMessage = "",
  onAccept,
  onReject,
  onCancel,
  className = "",
}) {
  const {
    id: exchangeOfferId,
    offeredCard,
    requester,
    saleListing,
  } = exchangeOffer;
  const status = normalizeEnum(exchangeOffer.status);
  const gradeClassName = getGradeClassName(offeredCard.grade);
  const gradeLabel = getCardGradeLabel(normalizeEnum(offeredCard.grade));
  const categoryLabel = getCardCategoryLabel(
    normalizeEnum(offeredCard.category),
  );
  const isPending = status === "PENDING";
  const isActionable = isPending && !isProcessing;
  const isRequester = viewerRole === "requester";
  const isSeller = viewerRole === "seller";
  const imageStyle = offeredCard.imageUrl
    ? { "--photo-card-image": `url("${offeredCard.imageUrl}")` }
    : undefined;
  // 구조적으로는 isSeller가 크게 필요하지 않지만 두 역할을 명시적으로 검증하려는 목적
  if (!isRequester && !isSeller) {
    return null;
  }

  return (
    <article
      className={`${styles.card} ${className}`.trim()}
      data-card-variant="exchange"
      data-grade={gradeClassName}
      data-status={status.toLowerCase()}
      aria-label={`${offeredCard.name}, ${gradeLabel} 등급 교환 제안 카드`}
      aria-busy={isProcessing}
    >
      <div
        className={styles.image}
        role="img"
        aria-label={`${offeredCard.name} 포토카드 이미지`}
        style={imageStyle}
      />

      <div className={styles.content}>
        <div className={styles.heading}>
          <h2 title={offeredCard.name}>{offeredCard.name}</h2>

          <div className={styles.metaLine}>
            <span className={styles.metaStart}>
              <span className={`${styles.grade} ${styles[gradeClassName]}`}>
                {gradeLabel}
              </span>
              <Divider />
              <span className={styles.category}>{categoryLabel}</span>
            </span>

            <span className={styles.purchasePrice}>
              <Divider />
              <strong>{formatPoints(saleListing.price)}</strong>
              <span>에 구매</span>
            </span>

            <span className={styles.nickname}>{requester.nickname}</span>
          </div>
        </div>

        <div className={styles.rule} />
        {offeredCard.description && (
          <p className={styles.description}>{offeredCard.description}</p>
        )}
        {/* 추후 공통 에러 객체로 리팩터링 */}
        {errorMessage && (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}
      </div>

      <div
        className={`${styles.actions} ${
          isRequester ? styles.requesterActions : ""
        }`.trim()}
      >
        {isPending ? (
          isRequester ? (
            <button
              type="button"
              className={styles.cancel}
              onClick={() => onCancel?.({ exchangeOfferId })}
              disabled={!isActionable || !onCancel}
            >
              <span className={styles.desktopButtonText}>
                {isProcessing ? "처리 중" : "취소하기"}
              </span>
              <span className={styles.mobileButtonText}>
                {isProcessing ? "처리 중" : "취소"}
              </span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.reject}
                onClick={() => onReject?.({ exchangeOfferId })}
                disabled={!isActionable || !onReject}
              >
                <span className={styles.desktopButtonText}>
                  {isProcessing ? "처리 중" : "거절하기"}
                </span>
                <span className={styles.mobileButtonText}>
                  {isProcessing ? "처리 중" : "거절"}
                </span>
              </button>
              <button
                type="button"
                className={styles.accept}
                onClick={() => onAccept?.({ exchangeOfferId })}
                disabled={!isActionable || !onAccept}
              >
                <span className={styles.desktopButtonText}>
                  {isProcessing ? "처리 중" : "승인하기"}
                </span>
                <span className={styles.mobileButtonText}>
                  {isProcessing ? "처리 중" : "승인"}
                </span>
              </button>
            </>
          )
        ) : (
          <p className={styles.resolvedStatus} role="status">
            {getExchangeStatusLabel(status)}
          </p>
        )}
      </div>
    </article>
  );
}
