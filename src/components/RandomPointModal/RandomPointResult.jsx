import Image from 'next/image';
import styles from './RandomPointResult.module.css';

export default function RandomPointResult({ onClose }) {
  return (
    <div className={styles.wrapper}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="random-point-result-title"
        className={styles.content}
      >

        <button
          className={styles.closeBtn}
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
          autoFocus
        >
          <Image
            src="/assets/ic_close.svg"
            width={25}
            height={25}
            alt=""
          />
        </button>

        <h2 className={styles.title} id="random-point-result-title">
          랜덤<span>포인트</span>
        </h2>

        <Image
          className={styles.pointImage}
          src="/assets/ic_point.png"
          width={340}
          height={324}
          alt=""
        />

        <p 
          className={styles.result}
        >
          <span>50P</span> 획득!
        </p>

        <p className={styles.nextAvailable}>
          다음 랜덤박스는
          <br className={styles.mobileBreak} /> 
          <span> 오늘 낮 12시</span>에 열려요
        </p>
      </div>
    </div>
  )
}
