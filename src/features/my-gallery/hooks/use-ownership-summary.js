"use client";

import { useQuery } from "@tanstack/react-query";
import { galleryKeys } from "@/lib/query-keys";
import { getOwnershipSummary } from "../api/gallery-api";

export default function useOwnershipSummary(keyword = "") {
  const normalizedKeyword = keyword.trim();
  return useQuery({
    queryKey: galleryKeys.summary(normalizedKeyword),
    queryFn: () => getOwnershipSummary(normalizedKeyword),
    refetchOnMount: "always",
  });
}
