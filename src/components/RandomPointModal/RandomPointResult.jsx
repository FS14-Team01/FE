import Image from "next/image";
import closeIcon from "../../../public/assets/ic_close.png";
import point from "../../../public/assets/ic_point.png";
import styles from "./RandomPointResult.module.css";

export default function RandomPointResult() {
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
          aria-label="모달 닫기"
        >
          <Image
            src={closeIcon}
            width={17}
            height={17}
            alt=""
            loading="eager"
          />
        </button>

        <p className={styles.title}>
          랜덤<span>포인트</span>
        </p>

        <Image
          src={point}
          width={340}
          height={324}
          alt=""
          loading="eager"
        />

        <p 
          className={styles.result}
          id="random-point-result-title"
        >
          <span>50P</span> 획득!
        </p>

        <p className={styles.nextAvailable}>
          다음 랜덤박스는 <span>오늘 낮 12시</span>에 열려요
        </p>
      </div>
    </div>
  )
}