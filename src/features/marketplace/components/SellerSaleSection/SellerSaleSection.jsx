import styles from './SellerSaleSection.module.css'

export default function SellerSaleSection({ sale }) {
  return (
    <section
      className={styles.section}
      aria-labelledby="seller-sale-section-title"
      data-sale-id={sale.id}
    >
      <div className={styles.heading}>
        <h2 id="seller-sale-section-title" className={styles.title}>
          교환 희망 정보
        </h2>
      </div>

      <div className={styles.preference}>
        {/* 교환 희망 등급, 장르 및 설명 */}
      </div>

      <div className={styles.actions}>
        <button className={styles.primary} type="button">
          수정하기
        </button>
        <button className={styles.secondary} type="button">
          판매 내리기
        </button>
      </div>
    </section>
  )
}
