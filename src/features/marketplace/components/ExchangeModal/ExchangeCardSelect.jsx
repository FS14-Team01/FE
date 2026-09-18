"use client";

import { useEffect, useRef, useState } from "react";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import MobileFilterSheet from "@/components/MobileFilterSheet/MobileFilterSheet";
import {
  CARD_CATEGORY_OPTIONS,
  CARD_GRADE_OPTIONS,
} from "@/constants/marketplace-options";
import OwnedExchangeCard from "./OwnedExchangeCard";
import ExchangeListStatus from "./ExchangeListStatus";
import styles from "./ExchangeModal.module.css";

const GRADE_OPTIONS = [
  { value: "", label: "전체 등급" },
  ...CARD_GRADE_OPTIONS,
];
const CATEGORY_OPTIONS = [
  { value: "", label: "전체 카테고리" },
  ...CARD_CATEGORY_OPTIONS,
];

export default function ExchangeCardSelect({
  ownerships,
  filters,
  onFiltersChange,
  onSelect,
  isLoading = false,
  errorMessage = "",
  isRetrying = false,
  onRetry,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}) {
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  const listViewportRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    listViewportRef.current.scrollTop = 0;
  }, [filters.keyword, filters.grade, filters.category]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (
      !sentinel ||
      !hasNextPage ||
      errorMessage ||
      isRetrying ||
      isLoading ||
      isFetchingNextPage ||
      !onLoadMore
    )
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        onLoadMore();
      },
      { root: sentinel.closest("[data-exchange-scroll]"), rootMargin: "160px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    hasNextPage,
    errorMessage,
    isRetrying,
    isLoading,
    isFetchingNextPage,
    onLoadMore,
    ownerships.length,
  ]);

  const handleSearch = (value) => {
    onFiltersChange({ ...filters, keyword: value.trim() });
  };

  const handleFilterKeyDown = (event) => {
    // 드롭다운이 열린 상태에서는 Escape로 교환 모달까지 닫지 않는다.
    if (
      event.key === "Escape" &&
      event.currentTarget.querySelector('[aria-expanded="true"]')
    ) {
      event.preventDefault();
    }
  };

  const handleMobileFilterKeyDown = (event) => {
    if (event.key !== "Escape") return;
    // 포털의 키 이벤트도 React 부모로 전달된다. 공통 필터의 닫기 버튼을
    // 실행해 필터만 닫고 교환 모달과 입력 상태는 그대로 유지한다.
    const closeButton = event.target
      .closest('[role="dialog"]')
      ?.querySelector('button[aria-label="필터 닫기"]');
    if (!closeButton) return;
    event.preventDefault();
    event.stopPropagation();
    closeButton.click();
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div
          className={styles.mobileFilter}
          onKeyDown={handleMobileFilterKeyDown}
        >
          <MobileFilterSheet
            gradeOptions={CARD_GRADE_OPTIONS}
            categoryOptions={CARD_CATEGORY_OPTIONS}
            grade={filters.grade}
            category={filters.category}
            onApply={({ grade, category }) =>
              onFiltersChange({ ...filters, grade, category })
            }
          />
        </div>
        <SearchInput
          className={styles.search}
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
        />
        <div
          className={styles.desktopFilters}
          onKeyDownCapture={handleFilterKeyDown}
        >
          <Dropdown
            options={GRADE_OPTIONS}
            value={filters.grade || undefined}
            label="등급 필터"
            placeholder="등급"
            onChange={(grade) =>
              onFiltersChange({ ...filters, grade, category: "" })
            }
          />
          <Dropdown
            options={CATEGORY_OPTIONS}
            value={filters.category || undefined}
            label="카테고리 필터"
            placeholder="카테고리"
            onChange={(category) =>
              onFiltersChange({ ...filters, grade: "", category })
            }
          />
        </div>
      </div>
      <div ref={listViewportRef} className={styles.cardListViewport}>
        {isLoading ? (
          <ExchangeListStatus message="보유 카드를 불러오는 중입니다." />
        ) : ownerships.length === 0 && !errorMessage ? (
          <ExchangeListStatus
            message={
              filters.keyword || filters.grade || filters.category
                ? "조건에 맞는 보유 카드가 없습니다."
                : "보유한 포토카드가 없습니다."
            }
          />
        ) : ownerships.length > 0 ? (
          <ul className={styles.cardGrid} aria-label="교환할 보유 포토카드">
            {ownerships.map((ownership) => (
              <li key={ownership.id} className={styles.cardOption}>
                <OwnedExchangeCard
                  ownership={ownership}
                  disabled={ownership.quantity < 1}
                  onSelect={() => onSelect(ownership)}
                />
              </li>
            ))}
          </ul>
        ) : null}
        {isFetchingNextPage && (
          <ExchangeListStatus message="보유 카드를 더 불러오는 중입니다." />
        )}
        {errorMessage && (
          <ExchangeListStatus
            message={errorMessage}
            isError
            onRetry={onRetry}
            isRetrying={isRetrying}
          />
        )}
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      </div>
    </>
  );
}
