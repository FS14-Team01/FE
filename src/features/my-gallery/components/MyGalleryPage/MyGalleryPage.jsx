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
import { useToast } from "@/components/common/Toast/ToastProvider";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import useMyGallery from "@/features/my-gallery/hooks/use-my-gallery";
import useInfiniteMyGallery from "@/features/my-gallery/hooks/use-infinite-my-gallery";
import usePhotoCardCreationStatus from "@/features/my-gallery/hooks/use-photo-card-creation-status";

import styles from "./MyGalleryPage.module.css";

export default function MyGalleryPage() {
  const router = useRouter();
  const loadMoreRef = useRef(null);
  const { showToast } = useToast();

  // 사용자 정보
  const { data: currentUser } = useCurrentUser();
  const nickname = currentUser?.nickname ?? "";

  // 생성 상태
  const {
    data: creationStatus,
    isLoading: isCreationStatusLoading,
    isError: isCreationStatusError,
    refetch: refetchCreationStatus,
  } = usePhotoCardCreationStatus();

  const weeklyCreatedCount = creationStatus?.weeklyCreatedCount ?? 0;
  const remainingCount = creationStatus?.remainingCount ?? 0;
  const weeklyLimit = creationStatus?.weeklyLimit ?? 3;
  const canCreate = creationStatus?.canCreate ?? false;

  const isCreateDisabled =
    isCreationStatusLoading || (!!creationStatus && !canCreate);

  // 초기화까지 남은 시간
  const [remainingTime, setRemainingTime] = useState("");

  // 생성 버튼
  const handleCreateClick = () => {
    if (isCreationStatusLoading) return;

    if (isCreationStatusError || !creationStatus) {
      showToast({
        status: "info",
        message: "생성 상태를 불러오지 못했어요. 다시 시도해 주세요.",
      });

      void refetchCreationStatus();
      return;
    }

    if (!canCreate) {
      showToast({
        status: "info",
        message: "이번 주 모든 생성 기회를 소진했어요.",
      });

      return;
    }

    router.push("/my-gallery/create");
  };

  // 초기화 시간 계산
  useEffect(() => {
    const resetsAt = creationStatus?.resetsAt;

    if (!resetsAt || weeklyCreatedCount === 0) return;

    const resetTime = new Date(resetsAt).getTime();

    const updateRemainingTime = () => {
      const difference = resetTime - Date.now();

      if (difference <= 0) {
        setRemainingTime("");
        return;
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      setRemainingTime(
        `${days}일 ${hours}시간 ${minutes}분`
      );
    };

    const initialTimer = setTimeout(updateRemainingTime, 0);

    const intervalTimer = setInterval(
      updateRemainingTime,
      60 * 1000
    );

    // 초기화 시 상태 재조회
    const resetDelay = Math.max(resetTime - Date.now(), 0);

    const resetTimer = setTimeout(() => {
      setRemainingTime("");
      void refetchCreationStatus();
    }, resetDelay + 500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      clearTimeout(resetTimer);
    };
  }, [
    creationStatus?.resetsAt,
    weeklyCreatedCount,
    refetchCreationStatus,
  ]);

  // 검색 / 필터
  const [keyword, setKeyword] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleMobileFilterApply = ({ grade, category }) => {
    setSelectedGrade(grade ?? "");
    setSelectedCategory(category ?? "");
  };

  const filters = {
    keyword: keyword || undefined,
    grade: selectedGrade || undefined,
    category: selectedCategory || undefined,
    limit: 12,
  };

  const hasFilters =
    keyword || selectedGrade || selectedCategory;

  // 카드 목록
  const {
    data,
    isLoading,
    isLoadingError,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMyGallery(filters);

  // 전체 보유 통계
  const { data: summaryData } = useMyGallery({
    limit: 12,
  });

  const photoCardList =
    data?.pages.flatMap((page) => page.items) ?? [];

  const totalCount =
    summaryData?.summary?.totalQuantity ?? 0;

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

  // 무한스크롤
  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage || isFetchNextPageError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetchNextPageError
        ) {
          void fetchNextPage();
        }
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  ]);

  // 최초 로딩
  if (isLoading && !data) {
    return (
      <div className={styles.stateWrap}>
        <p>마이갤러리를 불러오는 중입니다.</p>
      </div>
    );
  }

  // 최초 조회 실패
  if (isLoadingError) {
    return (
      <div className={styles.stateWrap}>
        <p>마이갤러리를 불러오지 못했습니다.</p>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => void refetch()}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.myGalleryWrap}>
      {/* 제목 / 생성 */}
      <div className={styles.titleWrap}>
        <div className={styles.title}>마이 갤러리</div>

        <div className={styles.createInfoWrap}>
          <div className={styles.createCountInfo}>
            {weeklyCreatedCount > 0 &&
              remainingTime &&
              `초기화까지 ${remainingTime}`}
          </div>

          <Button
            className={`${styles.btnCreate} ${isCreateDisabled
              ? styles.btnCreateDisabled
              : ""
              }`}
            type="button"
            variant="primary"
            size="lg"
            aria-disabled={isCreateDisabled}
            onClick={handleCreateClick}
          >
            {isCreationStatusLoading
              ? "생성 상태 확인 중..."
              : isCreationStatusError
                ? "생성 상태 다시 불러오기"
                : weeklyCreatedCount === 0
                  ? "포토카드 생성하기"
                  : `남은 생성 횟수 ${remainingCount}/${weeklyLimit}`}
          </Button>
        </div>
      </div>

      {/* 보유 현황 */}
      <div className={styles.ownershipWrap}>
        <div className={styles.title}>
          {nickname}님이 보유한 포토카드
          <span>({totalCount}장)</span>
        </div>

        <div className={styles.gradeWrap}>
          {gradeCounts.map((item) => (
            <div
              key={item.grade}
              className={`${styles.grade} ${styles[item.grade.toLowerCase()]
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
          <MobileFilterSheet
            gradeOptions={GRADE_OPTIONS}
            categoryOptions={CATEGORY_OPTIONS}
            grade={selectedGrade}
            category={selectedCategory}
            counts={gradeQuantities}
            totalCount={totalCount}
            onApply={handleMobileFilterApply}
          />
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

      {/* 카드 목록 */}
      {photoCardList.length === 0 ? (
        <div className={styles.stateWrap}>
          <p>
            {hasFilters
              ? "조건에 맞는 포토카드가 없습니다."
              : "아직 보유한 포토카드가 없습니다."}
          </p>
        </div>
      ) : (
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
      )}

      {/* 다음 페이지 */}
      <div ref={loadMoreRef} className={styles.loadMoreWrap}>
        {isFetchingNextPage && (
          <p>불러오는 중...</p>
        )}

        {isFetchNextPageError && (
          <>
            <p>포토카드를 더 불러오지 못했습니다.</p>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => void fetchNextPage()}
            >
              다시 시도
            </Button>
          </>
        )}
      </div>
    </div>
  );
}