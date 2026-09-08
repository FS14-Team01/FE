import styles from './ExchangeOfferSection.module.css'

export default function ExchangeOfferSection({ saleId }) {
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
        {/* 교환 제시 목록, 승인 및 거절 기능 */}
      </div>
    </section>
  )
}
