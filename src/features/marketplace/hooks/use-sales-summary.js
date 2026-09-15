"use client";

import { useQuery } from "@tanstack/react-query";
import { saleKeys } from "@/lib/query-keys";
import { getMySalesSummary } from "../api/sales-api";

export default function useSalesSummary() {
  return useQuery({
    queryKey: saleKeys.summary(),
    queryFn: getMySalesSummary,
  });
}
