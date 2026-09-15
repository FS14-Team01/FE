"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth-api";
import { clearAccessToken } from "@/lib/auth-token";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAccessToken();

      queryClient.removeQueries();
    },
  });
}
