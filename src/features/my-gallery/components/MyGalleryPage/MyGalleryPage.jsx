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
import usePhotoCardCreationStatus from "@/features/my-gallery/hooks/use-photo-card-creation-status";

import { useToast } from "@/components/common/Toast/ToastProvider";

import styles from "./MyGalleryPage.module.css";

export default function MyGalleryPage() {
  const router = useRouter();
  const loadMoreRef = useRef(null);
  const { showToast } = useToast();

  // 현재 로그인한 사용자 정보
  const { data: currentUser } = useCurrentUser();
  const nickname = currentUser?.nickname ?? "";

  // 포토카드 생성 가능 상태
  const { data: creationStatus } =
    usePhotoCardCreationStatus();

  // 이번 주에 이미 생성한 포토카드 횟수
  const weeklyCreatedCount = creationStatus?.weeklyCreatedCount ?? 0;

  // 이번 주에 남은 포토카드 생성 가능 횟수
  const remainingCount = creationStatus?.remainingCount ?? 0;

  // 주간 포토카드 생성 최대 횟수
  const weeklyLimit = creationStatus?.weeklyLimit ?? 3;

  // 현재 포토카드 생성 가능 여부
  const canCreate = creationStatus?.canCreate ?? false;

  // 다음 생성 횟수 초기화까지 남은 시간
  const [remainingTime, setRemainingTime] = useState("");

  // 포토카드 생성 버튼 클릭
  const handleCreateClick = () => {
    // 생성 상태 조회 전에는 동작하지 않음
    if (!creationStatus) return;

    // 이번 주 생성 횟수를 모두 사용한 경우
    if (!canCreate) {
      showToast({
        status: "info",
        message: "이번 주 모든 생성 기회를 소진했어요.",
      });

      return;
    }

    router.push("/my-gallery/create");
  };

  // 다음 주 월요일 00:00까지 남은 시간 계산
  useEffect(() => {
    const resetsAt = creationStatus?.resetsAt;

    if (!resetsAt) {
      setRemainingTime("");
      return;
    }

    const updateRemainingTime = () => {
      const resetTime = new Date(resetsAt).getTime();
      const now = Date.now();
      const difference = resetTime - now;

      if (difference <= 0) {
        setRemainingTime("곧 초기화");
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

    updateRemainingTime();

    const timer = setInterval(
      updateRemainingTime,
      60 * 1000
    );

    return () => {
      clearInterval(timer);
    };
  }, [creationStatus?.resetsAt]);

  /* 검색 / 필터 */
  const [keyword, setKeyword] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");

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
  const photoCardList = data?.pages.flatMap((page) => page.items) ?? [];

  // 전체 보유 수량
  const totalCount = summaryData?.summary?.totalQuantity ?? 0;

  // 전체 등급별 보유 수량
  const gradeQuantities = summaryData?.summary?.gradeQuantities ?? {};

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

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

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
        <div className={styles.title}>
          마이 갤러리
        </div>

        <div className={styles.createInfoWrap}>
          <div className={styles.createCountInfo}>
            {remainingTime &&
              `초기화까지 ${remainingTime}`}
          </div>

          <Button
            className={`${styles.btnCreate} ${!canCreate ? styles.btnCreateDisabled : ""
              }`}
            type="button"
            variant="primary"
            size="lg"
            aria-disabled={!canCreate}
            onClick={handleCreateClick}
          >
            {weeklyCreatedCount === 0
              ? "포토카드 생성하기"
              : `남은 생성 횟수 ${remainingCount}/${weeklyLimit}`}
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
              className={`${styles.grade} ${styles[item.grade.toLowerCase()]
                }`}
            >
              {item.grade.replace("_", " ")}{" "}
              {item.count}장
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