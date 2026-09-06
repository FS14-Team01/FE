import styles from '../PhotoCard/PhotoCard.module.css';

export default function PhotoCard(
  {
    imageUrl,
    name,
    grade,
    category,
    price,
    initialQuantity,
    remainingQuantity,
    status,
    sellerNickname,
  }
) {
  return (
    <div className={styles.photoCard}>
      <div className={styles.imgWrap}>
        <img
          src={imageUrl}
          alt={name}
        />
        {/* soldOut일 때 */}
        {/* <div className={styles.soldOut}>
          <img src="../assets/ic_soldout.svg" alt="ic_soldout" />
          <div className={styles.dim}></div>
        </div> */}
      </div>
      <div className={styles.textWrap}>
        <div className={styles.name}>
          {name} 이름
        </div>
        <div className={styles.InfoWrap}>
          <div className="gradeCategory">
            <div className={styles.grade}>
              {grade}등급
            </div>
            <div className={styles.category}>
              {category}카테고리
            </div>
          </div>
          <div className="ownerName">
            미쓰손
          </div>
        </div>
        <div className={styles.saleInfo}>
          {/* 마이 갤러리에선 가격 부분 안 보임 */}
          <div className={styles.price}>
            <div className={styles.title}>
              가격
            </div>
            <div className={styles.data}>
              
            </div>
          </div>
          <div className={styles.supply}>
            <div className={styles.title}>
              잔여
            </div>
            <div className={styles.data}>
              
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