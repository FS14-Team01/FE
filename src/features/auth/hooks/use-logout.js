"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth-api";
import { clearAccessToken } from "@/lib/auth-token";
import { useRouter } from "next/navigation";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAccessToken();

      queryClient.removeQueries();
      router.replace("/marketplace");
    },
  });
}
