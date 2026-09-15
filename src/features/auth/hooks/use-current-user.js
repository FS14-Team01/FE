"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/auth-token";
import { userKeys } from "@/lib/query-keys";
import { getMyInfo } from "../api/auth-api";

export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyInfo,
    enabled: Boolean(getAccessToken()),
  });
}
