"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/common/AuthHeader/AuthHeader";
import Modal from "@/components/common/Modal/Modal";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import MobileFilterSheet from "@/components/MobileFilterSheet/MobileFilterSheet";
import PhotoCard from "@/components/common/PhotoCard/PhotoCard";
import Button from "@/components/common/Button/Button";
import SaleCreateModal from "@/features/marketplace/components/SaleCreateModal/SaleCreateModal";
import {
  GRADE_OPTIONS,
  CATEGORY_OPTIONS,
  SALE_STATUS_OPTIONS,
  MARKET_SORT_OPTIONS,
} from "@/components/common/Dropdown/dropdownOptions";
import useSales from "@/features/marketplace/hooks/use-sales";
import useMarketSummary from "@/features/marketplace/hooks/use-market-summary";
import { getAccessToken } from "@/lib/auth-token";
import styles from "./page.module.css";

const PAGE_SIZE = 12;

export default function MarketplacePage() {
  const [isSaleCreateModalOpen, setIsSaleCreateModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [grade, setGrade] = useState();
  const [category, setCategory] = useState();
  const [saleStatus, setSaleStatus] = useState();
  const [sort, setSort] = useState("recent");
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const sentinelRef = useRef(null);
  const router = useRouter();

  // 객체를 그대로 넘기면 매 렌더마다 새 참조라 쿼리가 다시 실행된다
  const filters = useMemo(
    () => ({
      keyword: searchedKeyword.trim(),
      grade,
      category,
      status: saleStatus,
      sort,
    }),
    [searchedKeyword, grade, category, saleStatus, sort],
  );

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSales(filters, PAGE_SIZE);

  const sales = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const summaryQuery = useMarketSummary(searchedKeyword);
  const summary = summaryQuery.isError ? undefined : summaryQuery.data;
  const filterCounts = summary ? {
    ...summary.gradeCounts,
    ...summary.categoryCounts,
    ...summary.statusCounts,
  } : undefined;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      // 한 번 불러온 뒤에는 다음 렌더에서 재관찰하도록 즉시 관찰을 끊는다.
      // 그렇지 않으면 sentinel이 화면에 남아 있는 동안 연속으로 발화한다.
      observer.unobserve(sentinel);
      fetchNextPage();
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 필터가 바뀌면 queryKey가 달라져 서버에서 첫 페이지부터 다시 받는다
  const handleSearch = (value) => {
    setSearchedKeyword(value);
  };

  // 검색어를 모두 지우면 엔터 없이도 전체 목록으로 돌아간다
  const handleKeywordChange = (value) => {
    setKeyword(value);
    if (value.trim() === "") setSearchedKeyword("");
  };

  const handleGradeChange = (value) => {
    setGrade((current) => current === value ? undefined : value);
    setCategory(undefined);
    setSaleStatus(undefined);
  };

  const handleCategoryChange = (value) => {
    setCategory((current) => current === value ? undefined : value);
    setGrade(undefined);
    setSaleStatus(undefined);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleMobileFilterApply = (next) => {
    setGrade(next.grade);
    setCategory(next.category);
    setSaleStatus(next.saleStatus);
  };

  const handleSellClick = () => {
    if (!getAccessToken()) {
      setIsLoginRequiredOpen(true);
      return;
    }

    setIsSaleCreateModalOpen(true);
  };

  // 토큰 조회는 클릭 시점에만 해야 SSR 결과와 어긋나지 않는다
  const handleCardClick = (event) => {
    // 그리드 여백이 아니라 카드를 눌렀을 때만 반응한다
    if (!event.target.closest("a")) return;
    if (getAccessToken()) return;

    event.preventDefault();
    event.stopPropagation();
    setIsLoginRequiredOpen(true);
  };

  return (
    <>
      <AuthHeader />

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
            onChange={handleKeywordChange}
            onSearch={handleSearch}
          />
          <div className={styles.searchLineBreak} aria-hidden="true" />

          <div className={styles.desktopFilter}>
            <Dropdown
              options={GRADE_OPTIONS}
              value={grade}
              onChange={handleGradeChange}
              placeholder="등급"
              label="등급 필터"
            />
          </div>

          <div className={styles.desktopFilter}>
            <Dropdown
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={handleCategoryChange}
              placeholder="장르"
              label="장르 필터"
            />
          </div>

          <MobileFilterSheet
            className={styles.mobileFilter}
            gradeOptions={GRADE_OPTIONS}
            categoryOptions={CATEGORY_OPTIONS}
            saleStatusOptions={SALE_STATUS_OPTIONS}
            grade={grade}
            category={category}
            saleStatus={saleStatus}
            counts={filterCounts}
            totalCount={summary?.totalCount}
            onApply={handleMobileFilterApply}
          />

          <div className={styles.sortArea}>
            <Dropdown
              options={MARKET_SORT_OPTIONS}
              value={sort}
              onChange={handleSortChange}
              label="정렬 기준"
              variant="sort"
            />
          </div>
        </div>
        <section className={styles.cardSection} aria-label="판매 중인 포토카드">
          {isPending && (
            <p className={styles.status}>목록을 불러오는 중입니다.</p>
          )}

          {isError && (
            <div className={styles.status}>
              <p>{error.message}</p>
              <Button type="button" onClick={() => refetch()}>
                다시 시도
              </Button>
            </div>
          )}

          {!isPending && !isError && (
            <>
              {/* Link의 이동보다 먼저 잡아야 해서 캡처 단계에서 가로챈다 */}
              <div className={styles.cardGrid} onClickCapture={handleCardClick}>
                {sales.map((sale) => (
                  <PhotoCard
                    key={sale.id}
                    href={`/marketplace/${sale.id}`}
                    imageUrl={sale.photoCard.imageUrl}
                    name={sale.photoCard.name}
                    grade={sale.photoCard.grade}
                    category={sale.photoCard.category}
                    creatorNickname={sale.seller?.nickname}
                    price={sale.price}
                    initialQuantity={sale.initialQuantity}
                    remainingQuantity={sale.remainingQuantity}
                    status={sale.status}
                  />
                ))}
              </div>

              {sales.length === 0 && (
                <p className={styles.empty}>조건에 맞는 포토카드가 없습니다.</p>
              )}

              {hasNextPage && (
                <div ref={sentinelRef} className={styles.sentinel} />
              )}
            </>
          )}
        </section>
      </main>

      <Button className={styles.sellButtonMobile} onClick={handleSellClick}>
        나의 포토카드 판매하기
      </Button>

      {isSaleCreateModalOpen && (
        <SaleCreateModal onClose={() => setIsSaleCreateModalOpen(false)} />
      )}

      {isLoginRequiredOpen && (
        <Modal
          title="로그인이 필요합니다."
          message={
            <>
              로그인 하시겠습니까?
              <br />
              다양한 서비스를 편리하게 이용하실 수 있습니다.
            </>
          }
          confirmText="확인"
          onConfirm={() => router.push("/login")}
          onClose={() => setIsLoginRequiredOpen(false)}
        />
      )}
    </>
  );
}
