"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/common/Button/Button.jsx";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import {
  CATEGORY_OPTIONS,
  GRADE_OPTIONS,
} from "@/components/common/Dropdown/dropdownOptions";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import MobileFilterSheet from "@/components/MobileFilterSheet/MobileFilterSheet";
import PhotoCard from "@/components/common/PhotoCard/PhotoCard";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import useMyGallery from "@/features/my-gallery/hooks/use-my-gallery";
import useInfiniteMyGallery from "@/features/my-gallery/hooks/use-infinite-my-gallery";

import styles from "./MyGalleryPage.module.css";

export default function MyGalleryPage() {
  const router = useRouter();
  const loadMoreRef = useRef(null);

  // 현재 로그인한 사용자 정보
  const { data: currentUser } = useCurrentUser();
  const nickname = currentUser?.nickname ?? "";

  /* 검색 / 필터 */
  const [keyword, setKeyword] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filters = {
    keyword: keyword || undefined,
    grade: selectedGrade || undefined,
    category: selectedCategory || undefined,
    limit: 12,
  };

  /* 카드 목록 - 무한스크롤 */
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMyGallery(filters);

  /* 전체 보유 통계 - 필터 적용 안 함 */
  const { data: summaryData } = useMyGallery({
    limit: 12,
  });

  // 카드 목록
  const photoCardList =
    data?.pages.flatMap((page) => page.items) ?? [];
    console.log("마이갤러리 카드 목록:", photoCardList);

  // 전체 보유 수량
  const totalCount =
    summaryData?.summary?.totalQuantity ?? 0;

  // 전체 등급별 보유 수량
  const gradeQuantities =
    summaryData?.summary?.gradeQuantities ?? {};

  const gradeCounts = [
    {
      grade: "COMMON",
      count: gradeQuantities.COMMON ?? 0,
    },
    {
      grade: "RARE",
      count: gradeQuantities.RARE ?? 0,
    },
    {
      grade: "SUPER_RARE",
      count: gradeQuantities.SUPER_RARE ?? 0,
    },
    {
      grade: "LEGENDARY",
      count: gradeQuantities.LEGENDARY ?? 0,
    },
  ];

  /* 마지막 영역이 화면에 들어오면 다음 페이지 조회 */
  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 최초 로딩일 때만 전체 로딩 화면 표시
  if (isLoading && !data) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>마이갤러리를 불러오지 못했습니다.</div>;
  }

  return (
    <div className={styles.myGalleryWrap}>
      {/* 제목 + 카드 생성 버튼 */}
      <div className={styles.titleWrap}>
        <div className={styles.title}>마이 갤러리</div>

        <div className={styles.createInfoWrap}>
          <div className={styles.createCountInfo}>
            남은 시간
          </div>

          <Button
            className={styles.btnCreate}
            type="button"
            variant="primary"
            size="lg"
            onClick={() => router.push("/my-gallery/create")}
          >
            포토카드 생성하기
          </Button>
        </div>
      </div>

      {/* 전체 보유 현황 */}
      <div className={styles.ownershipWrap}>
        <div className={styles.title}>
          {nickname}님이 보유한 포토카드
          <span>({totalCount}장)</span>
        </div>

        <div className={styles.gradeWrap}>
          {gradeCounts.map((item) => (
            <div
              key={item.grade}
              className={`${styles.grade} ${
                styles[item.grade.toLowerCase()]
              }`}
            >
              {item.grade.replace("_", " ")} {item.count}장
            </div>
          ))}
        </div>
      </div>

      {/* 검색 / 필터 */}
      <div className={styles.searchWrap}>
        <div className={styles.mobileFilterWrap}>
          <MobileFilterSheet />
        </div>

        <div className={styles.searchInputWrap}>
          <SearchInput
            className={styles.searchInput}
            value={keyword}
            onChange={setKeyword}
          />
        </div>

        <div className={styles.dropDownWrap}>
          <div className={styles.gradeDropdown}>
            <Dropdown
              options={GRADE_OPTIONS}
              value={selectedGrade}
              onChange={setSelectedGrade}
              placeholder="등급"
              label="등급 필터"
              variant="filter"
            />
          </div>

          <div className={styles.categoryDropdown}>
            <Dropdown
              options={CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="장르"
              label="장르 필터"
              variant="filter"
            />
          </div>
        </div>
      </div>

      {/* 포토카드 목록 */}
      <div className={styles.photocardWrap}>
        {photoCardList.map((item) => (
          <PhotoCard
            key={item.photoCard.id}
            variant="ownership"
            name={item.photoCard.name}
            imageUrl={item.photoCard.imageUrl}
            category={item.photoCard.category}
            quantity={item.quantity}
            grade={item.photoCard.grade}
            creatorNickname={
  item.photoCard.creatorNickname ?? ""
}
            showPrice={false}
          />
        ))}
      </div>

      {/* 무한스크롤 감지 영역 */}
      <div ref={loadMoreRef}>
        {isFetchingNextPage && "불러오는 중..."}
      </div>
    </div>
  );
}