import ResponsiveHeader from '@/components/common/ResponsiveHeader/ResponsiveHeader';
import ExchangeOfferSection from '@/features/exchanges/components/ExchangeOfferSection/ExchangeOfferSection';
import styles from './page.module.css';

export default async function SaleDetailPage({ params }) {
  const { saleId } = await params;

  return (
    <>
      <ResponsiveHeader title="마켓플레이스" />

      <main className={styles.main}>
        <section
          className={styles.saleDetailSection}
          aria-label="판매 포토카드 상세 정보"
        >
          {/* 판매 상세 정보는 이 영역에서 구현합니다. */}
        </section>

        <ExchangeOfferSection saleId={saleId} />
      </main>
    </>
  );
}
