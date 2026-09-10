'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
// TODO: GET /sales 연동 후 제거
import { MOCK_SALE_LIST_RESPONSE } from '@/features/marketplace/marketplace-mock';
import styles from './page.module.css';

const PAGE_SIZE = 12;

const MOCK_SALES = MOCK_SALE_LIST_RESPONSE.items;

// TODO: GET /sales 연동 시 서버 쿼리로 대체
const SORT_COMPARATORS = {
  recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
};

export default function MarketplacePage() {
  const [keyword, setKeyword] = useState('');
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [grade, setGrade] = useState();
  const [category, setCategory] = useState();
  const [saleStatus, setSaleStatus] = useState();
  const [sort, setSort] = useState('recent');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const filteredSales = useMemo(() => {
    const normalizedKeyword = searchedKeyword.trim().toLowerCase();

    return MOCK_SALES.filter((sale) => {
      if (grade && sale.photoCard.grade !== grade) return false;
      if (category && sale.photoCard.category !== category) return false;
      if (saleStatus && sale.status !== saleStatus) return false;
      if (
        normalizedKeyword &&
        !sale.photoCard.name.toLowerCase().includes(normalizedKeyword)
      )
        return false;

      return true;
    }).sort(SORT_COMPARATORS[sort]);
  }, [searchedKeyword, grade, category, saleStatus, sort]);

  // 옵션별 개수는 다른 필터를 걸기 전 기준이라 검색어만 반영한다
  const filterCounts = useMemo(() => {
    const normalizedKeyword = searchedKeyword.trim().toLowerCase();
    const counts = {};

    for (const sale of MOCK_SALES) {
      if (
        normalizedKeyword &&
        !sale.photoCard.name.toLowerCase().includes(normalizedKeyword)
      )
        continue;

      const { grade: cardGrade, category: cardCategory } = sale.photoCard;

      counts[cardGrade] = (counts[cardGrade] ?? 0) + 1;
      counts[cardCategory] = (counts[cardCategory] ?? 0) + 1;
      counts[sale.status] = (counts[sale.status] ?? 0) + 1;
    }

    return counts;
  }, [searchedKeyword]);

  // 조건이 바뀌면 목록이 달라지므로 첫 페이지부터 다시 보여준다
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredSales]);

  const visibleSales = filteredSales.slice(0, visibleCount);
  const hasNextPage = visibleCount < filteredSales.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      // 한 번 불러온 뒤에는 다음 렌더에서 재관찰하도록 즉시 관찰을 끊는다.
      // 그렇지 않으면 sentinel이 화면에 남아 있는 동안 연속으로 발화한다.
      observer.unobserve(sentinel);
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredSales.length));
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, visibleCount, filteredSales.length]);

  const handleSearch = (value) => {
    setSearchedKeyword(value);
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
            counts={filterCounts}
            totalCount={filteredSales.length}
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
                key={sale.id}
                href={`/marketplace/${sale.id}`}
                imageUrl={sale.photoCard.imageUrl}
                name={sale.photoCard.name}
                grade={sale.photoCard.grade}
                category={sale.photoCard.category}
                creatorNickname={sale.seller.nickname}
                price={sale.price}
                initialQuantity={sale.initialQuantity}
                remainingQuantity={sale.remainingQuantity}
                status={sale.status}
              />
            ))}
          </div>
          {filteredSales.length === 0 && (
            <p className={styles.empty}>조건에 맞는 포토카드가 없습니다.</p>
          )}
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
