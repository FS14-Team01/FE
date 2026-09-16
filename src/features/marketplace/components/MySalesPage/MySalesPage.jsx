"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import {
  CATEGORY_OPTIONS,
  GRADE_OPTIONS,
  SALE_STATUS_OPTIONS,
} from "@/components/common/Dropdown/dropdownOptions";
import MobileFilterSheet from "@/components/MobileFilterSheet/MobileFilterSheet";
import PhotoCard from "@/components/common/PhotoCard/PhotoCard";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import useSalesList from "../../hooks/use-sales-list";
import useSalesSummary from "../../hooks/use-sales-summary";
import styles from "./MySalesPage.module.css";

const PAGE_SIZE = 12;

export default function MySalesPage() {
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [grade, setGrade] = useState();
  const [category, setCategory] = useState();
  const [status, setStatus] = useState();
  const sentinelRef = useRef(null);

  const filters = useMemo(
    () => ({
      ...(searchedKeyword.trim() && { keyword: searchedKeyword.trim() }),
      ...(grade && { grade }),
      ...(category && { category }),
      ...(status && { status }),
      limit: PAGE_SIZE,
    }),
    [searchedKeyword, grade, category, status],
  );

  const salesQuery = useSalesList(filters);
  const summaryQuery = useSalesSummary();
  const userQuery = useCurrentUser();
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = salesQuery;
  const sales = salesQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const summary = summaryQuery.data;
  const isInitialListError =
    salesQuery.isError && !isFetchNextPageError;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchNextPageError) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        observer.unobserve(sentinel);
        fetchNextPage();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  ]);

  const handleKeywordChange = (value) => {
    setKeyword(value);
    if (!value.trim()) setSearchedKeyword("");
  };

  const handleMobileFilterApply = (next) => {
    setGrade(next.grade);
    setCategory(next.category);
    setStatus(next.saleStatus);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>나의 판매 포토카드</h1>

      <section className={styles.summary} aria-label="판매 등록 포토카드 요약">
        {summaryQuery.isPending && (
          <p className={styles.summaryState}>판매 등록 수량을 불러오는 중입니다.</p>
        )}
        {summaryQuery.isError && (
          <div className={styles.summaryState} role="alert">
            <p>판매 등록 수량을 불러오지 못했습니다.</p>
            <button type="button" onClick={() => summaryQuery.refetch()}>
              다시 시도
            </button>
          </div>
        )}
        {summary && (
          <>
            <strong>
              {userQuery.data?.nickname
                ? `${userQuery.data.nickname}님이 판매 등록한 포토카드`
                : "판매 등록한 포토카드"}{" "}
              ({summary.totalQuantity}장)
            </strong>
            <div className={styles.gradeCounts}>
              {Object.entries(summary.gradeQuantities).map(
                ([cardGrade, count]) => (
                  <span
                    key={cardGrade}
                    className={styles[cardGrade.toLowerCase()]}
                  >
                    {cardGrade.replace("_", " ")} {count}장
                  </span>
                ),
              )}
            </div>
          </>
        )}
      </section>

      <div className={styles.filters}>
        <MobileFilterSheet
          className={styles.mobileFilter}
          gradeOptions={GRADE_OPTIONS}
          categoryOptions={CATEGORY_OPTIONS}
          saleStatusOptions={SALE_STATUS_OPTIONS}
          grade={grade}
          category={category}
          saleStatus={status}
          onApply={handleMobileFilterApply}
        />
        <SearchInput
          className={styles.search}
          value={keyword}
          onChange={handleKeywordChange}
          onSearch={setSearchedKeyword}
        />
        <Dropdown
          className={styles.desktopFilter}
          options={GRADE_OPTIONS}
          value={grade}
          onChange={(nextGrade) =>
            setGrade((currentGrade) =>
              currentGrade === nextGrade ? undefined : nextGrade,
            )
          }
          placeholder="등급"
          label="등급 필터"
        />
        <Dropdown
          className={styles.desktopFilter}
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(nextCategory) =>
            setCategory((currentCategory) =>
              currentCategory === nextCategory ? undefined : nextCategory,
            )
          }
          placeholder="장르"
          label="장르 필터"
        />
        <Dropdown
          className={styles.desktopFilter}
          options={SALE_STATUS_OPTIONS}
          value={status}
          onChange={(nextStatus) =>
            setStatus((currentStatus) =>
              currentStatus === nextStatus ? undefined : nextStatus,
            )
          }
          placeholder="판매방법"
          label="판매 상태 필터"
        />
      </div>

      {salesQuery.isPending && <p className={styles.state}>불러오는 중입니다.</p>}
      {isInitialListError && (
        <div className={styles.state}>
          <p>판매 목록을 불러오지 못했습니다.</p>
          <button type="button" onClick={() => salesQuery.refetch()}>
            다시 시도
          </button>
        </div>
      )}
      {!salesQuery.isPending && !isInitialListError && sales.length === 0 && (
        <p className={styles.state}>조건에 맞는 판매 포토카드가 없습니다.</p>
      )}

      <section className={styles.grid} aria-label="나의 판매 포토카드 목록">
        {sales.map((sale) => (
          <PhotoCard
            key={sale.id}
            variant="mySale"
            href={
              sale.status === "ON_SALE"
                ? `/marketplace/${sale.id}`
                : undefined
            }
            imageUrl={sale.photoCard.imageUrl}
            name={sale.photoCard.name}
            grade={sale.photoCard.grade}
            category={sale.photoCard.category}
            creatorNickname={sale.photoCard.creatorNickname}
            price={sale.price}
            initialQuantity={sale.initialQuantity}
            remainingQuantity={sale.remainingQuantity}
            status={sale.status}
            hasPendingExchange={sale.hasPendingExchange}
          />
        ))}
      </section>

      {hasNextPage && !isFetchNextPageError && (
        <div ref={sentinelRef} className={styles.sentinel} />
      )}
      {salesQuery.isFetchingNextPage && (
        <p className={styles.more}>목록을 더 불러오는 중입니다.</p>
      )}
      {isFetchNextPageError && (
        <div className={styles.more} role="alert">
          <p>목록을 추가로 불러오지 못했습니다.</p>
          <button type="button" onClick={() => fetchNextPage()}>
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
}
