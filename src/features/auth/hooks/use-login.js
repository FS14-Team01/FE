"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth-api.js";
import { setAccessToken } from "@/lib/auth-token.js";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (loginResult) => {
      setAccessToken(loginResult.accessToken);

      queryClient.removeQueries();
    },
  });
}
