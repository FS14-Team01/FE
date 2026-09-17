import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <Image
          className={styles.heroLogo}
          src="/assets/logo.png"
          alt="최애의 포토"
          width={250}
          height={49}
        />
        <h1>
          구하기 어려웠던
          <br />
          <span>나의 최애</span>가 여기에
        </h1>
        <Link href="/marketplace">최애 찾으러 가기</Link>
        <Image
          src="/landing/landing-hero1.png"
          alt="최애의 포토 마켓플레이스 화면"
          width={3834}
          height={1530}
        />
        <Image
          className={styles.heroBackground}
          src="/landing/landing-heroB.png"
          alt="포인트로 포토카드를 구매"
          width={5394}
          height={3264}
        />
      </section>

      <section className={`${styles.feature} ${styles.pointFeature}`}>
        <h2>
          포인트로 <span>안전하게 거래</span>하세요
        </h2>
        <p>
          내 포토카드를 포인트로 팔고, 원하는 포토카드를
          <br />
          포인트로 안전하게 교환하세요
        </p>

        <Image
          className={styles.pointImage}
          src="/landing/landing01A.png"
          alt="포인트로 포토카드를 구매"
          width={2136}
          height={1024}
        />
        <Image
          className={styles.pointBackground}
          src="/landing/landing01circle.png"
          alt="배경"
          width={2838}
          height={724}
        />
      </section>

      <section className={styles.feature}>
        <h2>
          알림으로 보다 <span>빨라진 거래</span>
        </h2>
        <p>
          교환 제안부터 판매 완료까지,
          <br />
          실시간 알림으로 놓치지 마세요
        </p>

        <Image
          src="/landing/landing02D.png"
          alt="거래 알림 화면"
          width={1508}
          height={1022}
        />
        <Image
          className={styles.pointBlueBackground}
          src="/landing/landing02circle.png"
          alt="배경"
          width={2838}
          height={724}
        />
      </section>

      <section className={styles.feature}>
        <h2>
          랜덤 상자로 <span>포인트 받자!</span>
        </h2>
        <p>
          하루에 두 번 주어지는 랜덤 상자를 열고,
          <br />
          포인트를 획득하세요
        </p>

        <Image
          src="/landing/landing03.png"
          alt="랜덤 포인트 상자"
          width={2809}
          height={1805}
        />
        <Image
          className={styles.giftBlueBackground}
          src="/landing/landing03bluebox.png"
          alt="배경"
          width={1574}
          height={676}
        />
        <Image
          className={styles.giftYellowBackground}
          src="/landing/landing03yellowbox.png"
          alt="배경"
          width={619}
          height={514}
        />
      </section>

      <section className={styles.lastCard}>
        <Image src="/landing/landing04.png" alt="" width={299} height={352} />
        <h2>나의 최애를 지금 찾아보세요</h2>
        <Link href="/marketplace">최애 찾으러 가기</Link>
      </section>
    </div>
  );
}
