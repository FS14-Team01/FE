'use client'

import styles from './ExchangeCard.module.css'

const CARD_GRADE_LABELS = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  SUPER_RARE: 'SUPER RARE',
  LEGENDARY: 'LEGENDARY',
}

const CARD_CATEGORY_LABELS = {
  POKEMON: '포켓몬',
  SUPER_MARIO: '슈퍼 마리오',
  HELLO_KITTY: '헬로키티',
  DIGIMON: '디지몬',
}

const EXCHANGE_STATUS_LABELS = {
  PENDING: '대기 중',
  ACCEPTED: '승인 완료',
  REJECTED: '거절 완료',
  CANCELLED: '취소됨',
}

function normalizeEnum(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replaceAll(' ', '_')
}

function getGradeClassName(grade) {
  return normalizeEnum(grade).toLowerCase()
}

function getGradeLabel(grade) {
  const key = normalizeEnum(grade)
  return CARD_GRADE_LABELS[key] ?? key.replaceAll('_', ' ')
}

function getCategoryLabel(category) {
  const key = normalizeEnum(category)
  return CARD_CATEGORY_LABELS[key] ?? String(category)
}

function formatPoints(points) {
  return `${new Intl.NumberFormat('ko-KR').format(points)} P`
}

function Divider() {
  return <span className={styles.separator} aria-hidden='true'>|</span>
}

export default function ExchangeCard({
  currentUserId,
  exchangeOffer,
  sale,
  isProcessing = false,
  errorMessage = '',
  onAccept,
  onReject,
  onCancel,
  className = '',
}) {
  const {
    id: exchangeOfferId,
    offeredCard,
    requester,
    saleListing,
  } = exchangeOffer
  const status = normalizeEnum(exchangeOffer.status)
  const gradeClassName = getGradeClassName(offeredCard.grade)
  const gradeLabel = getGradeLabel(offeredCard.grade)
  const categoryLabel = getCategoryLabel(offeredCard.category)
  const isPending = status === 'PENDING'
  const isActionable = isPending && !isProcessing
  const isMatchingSale = sale?.id === saleListing.id
  const isRequester = isMatchingSale && currentUserId === requester.id
  const isSeller = isMatchingSale && currentUserId === sale?.seller?.id
  const offerRole = isRequester ? 'requester' : isSeller ? 'seller' : 'viewer'
  const hasActionPermission = isRequester || isSeller
  const imageStyle = offeredCard.imageUrl
    ? { '--photo-card-image': `url("${offeredCard.imageUrl}")` }
    : undefined

  return (
    <article
      className={`${styles.card} ${className}`.trim()}
      data-card-variant='exchange'
      data-grade={gradeClassName}
      data-status={status.toLowerCase()}
      data-offer-role={offerRole}
      aria-label={`${offeredCard.name}, ${gradeLabel} 등급 교환 제안 카드`}
      aria-busy={isProcessing}
    >
      <div
        className={styles.image}
        role='img'
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
        {errorMessage && (
          <p className={styles.errorMessage} role='alert'>
            {errorMessage}
          </p>
        )}
      </div>

      <div
        className={`${styles.actions} ${
          isRequester ? styles.requesterActions : ''
        }`.trim()}
      >
        {isPending && hasActionPermission ? (
          isRequester ? (
            <button
              type='button'
              className={styles.cancel}
              onClick={() => onCancel?.({ exchangeOfferId })}
              disabled={!isActionable || !onCancel}
            >
              <span className={styles.desktopButtonText}>
                {isProcessing ? '처리 중' : '취소하기'}
              </span>
              <span className={styles.mobileButtonText}>
                {isProcessing ? '처리 중' : '취소'}
              </span>
            </button>
          ) : (
            <>
              <button
                type='button'
                className={styles.reject}
                onClick={() => onReject?.({ exchangeOfferId })}
                disabled={!isActionable || !onReject}
              >
                <span className={styles.desktopButtonText}>
                  {isProcessing ? '처리 중' : '거절하기'}
                </span>
                <span className={styles.mobileButtonText}>
                  {isProcessing ? '처리 중' : '거절'}
                </span>
              </button>
              <button
                type='button'
                className={styles.accept}
                onClick={() => onAccept?.({ exchangeOfferId })}
                disabled={!isActionable || !onAccept}
              >
                <span className={styles.desktopButtonText}>
                  {isProcessing ? '처리 중' : '승인하기'}
                </span>
                <span className={styles.mobileButtonText}>
                  {isProcessing ? '처리 중' : '승인'}
                </span>
              </button>
            </>
          )
        ) : (
          <p className={styles.resolvedStatus} role='status'>
            {EXCHANGE_STATUS_LABELS[status] ?? status}
          </p>
        )}
      </div>
    </article>
  )
}
