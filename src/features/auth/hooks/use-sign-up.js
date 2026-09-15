"use client";

import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/auth-api.js";
import { setAccessToken } from "@/lib/auth-token.js";

export function useSignup() {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (signUpResult) => {
      setAccessToken(signUpResult.accessToken);
    },
  });
}
