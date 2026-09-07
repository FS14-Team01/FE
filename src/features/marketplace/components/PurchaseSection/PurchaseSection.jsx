import styles from './PurchaseSection.module.css'

export default function PurchaseSection({ sale }) {
  return (
    <section
      className={styles.section}
      aria-label="포토카드 구매"
      data-sale-id={sale.id}
    >
      {/* 구매 기능 */}
    </section>
  )
}
