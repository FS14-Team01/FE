"use client";

import { useQuery } from "@tanstack/react-query";
import { galleryKeys } from "@/lib/query-keys";
import { getMyOwnerships } from "../api/gallery-api";

export default function useMyGallery(filters = {}) {
  return useQuery({
    queryKey: galleryKeys.list(filters),
    queryFn: () => getMyOwnerships(filters),
  });
}