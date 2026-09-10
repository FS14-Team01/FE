"use client";

import { useEffect, useRef, useState } from "react";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import ExchangeMobileFilter from "./ExchangeMobileFilter";
import {
  CARD_CATEGORY_OPTIONS,
  CARD_GRADE_OPTIONS,
} from "@/constants/marketplace-options";
import OwnedExchangeCard from "./OwnedExchangeCard";
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
      { root: sentinel.closest("dialog"), rootMargin: "160px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    onLoadMore,
    ownerships.length,
  ]);

  const handleSearch = (value) => {
    onFiltersChange({ ...filters, keyword: value.trim() });
  };

  const handleFilterKeyDown = (event) => {
    // 공통 Dropdown의 닫기 동작은 유지하고 상위 dialog의 기본 Escape만 막는다.
    if (
      event.key === "Escape" &&
      event.currentTarget.querySelector('[aria-expanded="true"]')
    ) {
      event.preventDefault();
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.mobileFilter}>
          <ExchangeMobileFilter
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
            onChange={(grade) => onFiltersChange({ ...filters, grade })}
          />
          <Dropdown
            options={CATEGORY_OPTIONS}
            value={filters.category || undefined}
            label="카테고리 필터"
            placeholder="카테고리"
            onChange={(category) => onFiltersChange({ ...filters, category })}
          />
        </div>
      </div>
      <div ref={listViewportRef} className={styles.cardListViewport}>
        {isLoading ? (
          <p className={styles.notice} role="status">
            보유 카드를 불러오는 중입니다.
          </p>
        ) : ownerships.length === 0 ? (
          <p className={styles.notice} role="status">
            조건에 맞는 보유 카드가 없습니다.
          </p>
        ) : (
          <ul className={styles.cardGrid} aria-label="교환할 보유 포토카드">
            {ownerships.map((ownership) => (
              <li key={ownership.id} className={styles.cardOption}>
                <OwnedExchangeCard ownership={ownership} />
                <button
                  type="button"
                  className={styles.selectButton}
                  aria-label={`${ownership.photoCard.name} 선택`}
                  title={ownership.photoCard.name}
                  disabled={ownership.quantity < 1}
                  onClick={() => onSelect(ownership)}
                />
              </li>
            ))}
          </ul>
        )}
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
        {isFetchingNextPage && (
          <p className={styles.notice} role="status">
            보유 카드를 더 불러오는 중입니다.
          </p>
        )}
      </div>
    </>
  );
}
