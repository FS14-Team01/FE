import styles from '../PhotoCard/PhotoCard.module.css';
import Link from 'next/link';

export default function PhotoCard({
  imageUrl,
  name,
  grade,
  category,
  creatorNickname,
  price,
  initialQuantity,
  remainingQuantity,
  quantity,
  status,
  variant,
  showPrice = true,
  href,
  hasPendingExchange,
}) {
  const gradeClass = {
    COMMON: styles.gradeCommon,
    RARE: styles.gradeRare,
    SUPER_RARE: styles.gradeSuperRare,
    LEGENDARY: styles.gradeLegendary,
  };

  const CardWrapper = href ? Link : 'div';

  return (
    <CardWrapper
      className={styles.photoCard}
      {...(href ? { href } : {})}
    >
      <div className={styles.imgWrap}>
        <img
          src={imageUrl}
          alt={name}
        />

        {/* SOLD_OUT일 때만 표시 */}
        {status === 'SOLD_OUT' && (
          <div className={styles.soldOut}>
            <img src="../assets/ic_soldout.svg" alt="ic_soldout" />
            <div className={styles.dim}></div>
          </div>
        )}

        {/* 나의 판매 포토카드에서만 상태 태그 표시 */}
        {variant === 'mySale' && status === 'ON_SALE' && (
          <div className={styles.saleTag}>
            {!hasPendingExchange ? (
              <div className={styles.onSale}>
                판매 중
              </div>
            ) : (
              <div className={styles.onChange}>
                교환 제시 대기 중
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.textWrap}>
        <div className={styles.name}>
          {name}
        </div>

        <div className={styles.infoWrap}>
          <div className={styles.gradeCategory}>
            <div className={gradeClass[grade]}>
              {grade?.replace('_', ' ')}
            </div>

            <div className={styles.line}></div>

            <div className={styles.category}>
              {category?.replace('_', ' ')}
            </div>
          </div>

          <div className={styles.ownerName}>
            {creatorNickname}
          </div>
        </div>

        <div className={styles.saleInfo}>
          {showPrice && (
            <div className={styles.price}>
              <div className={styles.title}>
                가격
              </div>

              <div className={styles.data}>
                {price} P
              </div>
            </div>
          )}

          <div className={styles.supply}>
            <div className={styles.title}>
              {variant === 'ownership' ? '수량' : '잔여'}
            </div>

            <div className={styles.data}>
              {variant === 'ownership' ? quantity : variant === 'mySale' ? remainingQuantity : <>{remainingQuantity}<span> / {initialQuantity}</span></>}
            </div>
          </div>
        </div>

        <div className={styles.cardBottom}>
          <img src="../assets/logo.png" alt="logo" />
        </div>
      </div>
    </CardWrapper>
  );
}