"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { galleryKeys } from "@/lib/query-keys";
import { createPhotoCard } from "../api/photo-card-api";

export default function useCreatePhotoCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPhotoCard,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: galleryKeys.all,
      });
    },
  });
}