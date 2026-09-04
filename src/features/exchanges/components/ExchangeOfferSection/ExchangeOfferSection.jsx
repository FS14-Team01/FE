import styles from './ExchangeOfferSection.module.css';

export default function ExchangeOfferSection({ saleId }) {
  return (
    <section
      className={styles.section}
      aria-labelledby="exchange-offer-heading"
      data-sale-id={saleId}
    >
      <h2 id="exchange-offer-heading" className={styles.title}>
        교환 제시 목록
      </h2>

      <div className={styles.content}>
        {/* 교환 담당자가 제시 목록, 승인 및 거절 기능을 구현하는 영역입니다. */}
      </div>
    </section>
  );
}
