"use client";

import { useQuery } from "@tanstack/react-query";
import { marketKeys } from "@/lib/query-keys";
import { getMarketSummary } from "../api/sales-api";

export default function useMarketSummary(keyword = "") {
  const normalizedKeyword = keyword.trim();
  return useQuery({
    queryKey: marketKeys.summary(normalizedKeyword),
    queryFn: () => getMarketSummary(normalizedKeyword),
    refetchOnMount: "always",
  });
}
