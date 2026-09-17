"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { galleryKeys } from "@/lib/query-keys";
import { getMyOwnerships } from "../api/gallery-api";

export default function useInfiniteMyGallery(filters = {}) {
  return useInfiniteQuery({
    queryKey: galleryKeys.infinite(filters),

    queryFn: ({ pageParam }) =>
      getMyOwnerships({
        ...filters,
        cursor: pageParam,
      }),

    // 첫 요청은 cursor 없이 시작
    initialPageParam: undefined,

    // 다음 페이지가 있으면 nextCursor 전달
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,

    // 검색/필터 변경 중 기존 화면 유지
    placeholderData: keepPreviousData,
  });
}