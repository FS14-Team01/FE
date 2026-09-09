'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/common/Header/Header';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import MobileFilterSheet from '@/components/MobileFilterSheet/MobileFilterSheet';
import PhotoCard from '@/components/common/PhotoCard/PhotoCard';
import Button from '@/components/common/Button/Button';
import {
  GRADE_OPTIONS,
  CATEGORY_OPTIONS,
  SALE_STATUS_OPTIONS,
  MARKET_SORT_OPTIONS,
} from '@/components/common/Dropdown/dropdownOptions';
import styles from './page.module.css';

const PAGE_SIZE = 12;

const GRADES = ['COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY'];
const CATEGORIES = ['POKEMON', 'SUPER_MARIO', 'HELLO_KITTY', 'DIGIMON'];
const NAMES = ['뉴진스 다니엘', '피카츄', '헬로키티', '디지몬 아구몬', '슈퍼마리오'];

// TODO: GET /sales 연동 후 제거
const DUMMY_SALES = Array.from({ length: 42 }, (_, index) => {
  const remainingQuantity = index % 5;

  return {
    saleId: index + 1,
    imageUrl: '/assets/logo.png',
    name: `${NAMES[index % NAMES.length]} ${index + 1}`,
    grade: GRADES[index % GRADES.length],
    category: CATEGORIES[index % CATEGORIES.length],
    creatorNickname: `유저${(index % 8) + 1}`,
    price: (index % 6) * 100,
    initialQuantity: 5,
    remainingQuantity,
    status: remainingQuantity === 0 ? 'SOLD_OUT' : 'ON_SALE',
  };
});

export default function MarketplacePage() {
  const [keyword, setKeyword] = useState('');
  const [grade, setGrade] = useState();
  const [category, setCategory] = useState();
  const [saleStatus, setSaleStatus] = useState();
  const [sort, setSort] = useState('recent');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const visibleSales = DUMMY_SALES.slice(0, visibleCount);
  const hasNextPage = visibleCount < DUMMY_SALES.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      // 한 번 불러온 뒤에는 다음 렌더에서 재관찰하도록 즉시 관찰을 끊는다.
      // 그렇지 않으면 sentinel이 화면에 남아 있는 동안 연속으로 발화한다.
      observer.unobserve(sentinel);
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, DUMMY_SALES.length));
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, visibleCount]);

  const handleSearch = (value) => {
    // TODO: marketKeys.list({ keyword: value, ... }) 연동
    console.log('검색어:', value);
  };

  const handleMobileFilterApply = (next) => {
    setGrade(next.grade);
    setCategory(next.category);
    setSaleStatus(next.saleStatus);
  };

  const handleSellClick = () => {
    // TODO: 판매 등록 페이지 경로 확정 후 연결
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>마켓플레이스</h1>

          <Button
            className={styles.sellButtonDesktop}
            onClick={handleSellClick}
          >
            나의 포토카드 판매하기
          </Button>
        </div>

        <div className={styles.filterRow}>
          <SearchInput
            className={styles.searchInput}
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />
          <div className={styles.searchLineBreak} aria-hidden="true" />

          <Dropdown
            options={GRADE_OPTIONS}
            value={grade}
            onChange={setGrade}
            placeholder="등급"
            label="등급 필터"
            className={styles.desktopFilter}
          />

          <Dropdown
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            placeholder="장르"
            label="장르 필터"
            className={styles.desktopFilter}
          />

          <MobileFilterSheet
            className={styles.mobileFilter}
            gradeOptions={GRADE_OPTIONS}
            categoryOptions={CATEGORY_OPTIONS}
            saleStatusOptions={SALE_STATUS_OPTIONS}
            grade={grade}
            category={category}
            saleStatus={saleStatus}
            onApply={handleMobileFilterApply}
          />

          <div className={styles.sortArea}>
            <Dropdown
              options={MARKET_SORT_OPTIONS}
              value={sort}
              onChange={setSort}
              label="정렬 기준"
              variant="sort"
            />
          </div>
        </div>
        <section className={styles.cardSection} aria-label="판매 중인 포토카드">
          <div className={styles.cardGrid}>
            {visibleSales.map((sale) => (
              <PhotoCard
                key={sale.saleId}
                href={`/marketplace/${sale.saleId}`}
                imageUrl={sale.imageUrl}
                name={sale.name}
                grade={sale.grade}
                category={sale.category}
                creatorNickname={sale.creatorNickname}
                price={sale.price}
                initialQuantity={sale.initialQuantity}
                remainingQuantity={sale.remainingQuantity}
                status={sale.status}
              />
            ))}
          </div>
          {hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}
        </section>
      </main>

      <Button
        className={styles.sellButtonMobile}
        onClick={handleSellClick}
      >
        나의 포토카드 판매하기
      </Button>
    </>
  );
}
