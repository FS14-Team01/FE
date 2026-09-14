"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth-api.js";
import { setAccessToken } from "@/lib/auth-token.js";

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (loginResult) => {
      setAccessToken(loginResult.accessToken);
    },
  });
}
