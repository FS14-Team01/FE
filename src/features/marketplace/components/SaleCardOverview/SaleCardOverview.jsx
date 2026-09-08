import styles from './SaleCardOverview.module.css';

export default function SaleCardOverview({ sale, children }) {
  const { photoCard, seller } = sale;

  return (
    <section className={styles.section} aria-labelledby="sale-card-title">
      <p className={styles.eyebrow}>마켓플레이스</p>
      <h1 id="sale-card-title" className={styles.title}>
        {photoCard.name}
      </h1>

      <div className={styles.content}>
        <div className={styles.imageArea}>
          <div
            className={styles.image}
            role="img"
            aria-label={`${photoCard.name} 포토카드`}
            style={{ backgroundImage: `url(${photoCard.imageUrl})` }}
          />
        </div>

        <div className={styles.information}>
          <div className={styles.meta}>
            <strong className={styles.grade}>{photoCard.grade}</strong>
            <span className={styles.category}>{photoCard.category}</span>
            <span className={styles.seller}>{seller.nickname}</span>
          </div>

          <p className={styles.description}>
            {photoCard.description ?? '등록된 포토카드 설명이 없습니다.'}
          </p>

          <dl className={styles.summary}>
            <div>
              <dt>가격</dt>
              <dd>{sale.price} P</dd>
            </div>
            <div>
              <dt>잔여</dt>
              <dd>
                <strong className={styles.remainingQuantity}>
                  {sale.remainingQuantity}
                </strong>{' '}
                <span className={styles.initialQuantity}>
                  / {sale.initialQuantity}
                </span>
              </dd>
            </div>
          </dl>

          {children}
        </div>
      </div>
    </section>
  );
}
