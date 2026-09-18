"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

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

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? lastPage.nextCursor
        : undefined,
  });
}