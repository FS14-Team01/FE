"use client";

import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/query-keys";
import { getMyInfo } from "../api/sales-api";

export default function useMyInfo() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyInfo,
  });
}
