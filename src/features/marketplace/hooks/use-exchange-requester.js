"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/auth-token";
import { userKeys } from "@/lib/query-keys";
import { getExchangeRequester } from "../api/requester-exchange-api";

function subscribe(notify) {
  window.addEventListener("storage", notify);
  return () => window.removeEventListener("storage", notify);
}
const getServerSnapshot = () => null;

export default function useExchangeRequester() {
  const token = useSyncExternalStore(
    subscribe,
    getAccessToken,
    getServerSnapshot,
  );
  const enabled = Boolean(token);
  const query = useQuery({
    queryKey: userKeys.me(),
    queryFn: ({ signal }) => getExchangeRequester({ signal }),
    enabled,
    retry: false,
    staleTime: 60_000,
  });
  return { ...query, authenticated: enabled };
}
