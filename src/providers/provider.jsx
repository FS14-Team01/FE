"use client";
import queryClient from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export default function Provider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}