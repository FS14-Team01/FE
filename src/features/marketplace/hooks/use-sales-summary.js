"use client";

import { useQuery } from "@tanstack/react-query";
import { saleKeys } from "@/lib/query-keys";
import { getMySalesSummary } from "../api/sales-api";

export default function useSalesSummary(keyword = "") {
  const normalizedKeyword = keyword.trim();

  return useQuery({
    queryKey: saleKeys.summary(normalizedKeyword),
    queryFn: () => getMySalesSummary(normalizedKeyword),
  });
}
