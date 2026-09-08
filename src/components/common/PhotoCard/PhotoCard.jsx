import styles from '../PhotoCard/PhotoCard.module.css';

export default function PhotoCard(
  {
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
    showPrice = true
  }
) {
  const gradeClass = {
    COMMON: styles.gradeCommon,
    RARE: styles.gradeRare,
    SUPER_RARE: styles.gradeSuperRare,
    LEGENDARY: styles.gradeLegendary,
  };
  return (
    <div className={styles.photoCard}>
      <div className={styles.imgWrap}>
        <img
          src={imageUrl}
          alt={name}
        />
        {/* soldout일때만 보임 */}
        {status === "SOLD_OUT" && (
          <div className={styles.soldOut}>
            <img src="../assets/ic_soldout.svg" alt="ic_soldout" />
            <div className={styles.dim}></div>
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
              {grade?.replace("_", " ")}
            </div>
            <div className={styles.line}>

            </div>
            <div className={styles.category}>
              {category?.replace("_", " ")}
            </div>
          </div>
          <div className={styles.ownerName}>
            {creatorNickname}
          </div>
        </div>
        <div className={styles.saleInfo}>
          {/* 마이 갤러리에선 가격 부분 안 보임 */}
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
              {variant === "ownership" ? "수량" : "잔여"}
            </div>
            <div className={styles.data}>
              {variant === "ownership" ? quantity : <>{remainingQuantity}<span> / {initialQuantity}</span></>}
            </div>
          </div>
        </div>
        <div className={styles.cardBottom}>
          <img src="../assets/logo.png" alt="logo" />
        </div>
      </div>
    </div>
  )
}