import Header from '@/components/common/Header/Header';
import styles from './page.module.css';

export default function MarketplacePage() {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>마켓플레이스</h1>
        </div>

        <div className={styles.filterRow}>
          <div className={styles.sortArea}>
          </div>

        </div>
        <section className={styles.cardSection} aria-label="판매 중인 포토카드">
        </section>
      </main>
    </>
  );
}
