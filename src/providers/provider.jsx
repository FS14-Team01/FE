"use client";
import queryClient from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { CommonProvider } from "./commonContext";

export default function Provider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CommonProvider>{children}</CommonProvider>
    </QueryClientProvider>
  );
}
