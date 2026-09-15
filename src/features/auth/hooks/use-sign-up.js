"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../api/auth-api.js";
import { setAccessToken } from "@/lib/auth-token.js";

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (signUpResult) => {
      setAccessToken(signUpResult.accessToken);

      queryClient.removeQueries();
    },
  });
}
