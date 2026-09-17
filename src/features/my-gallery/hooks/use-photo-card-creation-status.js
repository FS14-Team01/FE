"use client";

import { useQuery } from "@tanstack/react-query";
import { galleryKeys } from "@/lib/query-keys";
import { getPhotoCardCreationStatus } from "../api/gallery-api";

export default function usePhotoCardCreationStatus() {
  return useQuery({
    queryKey: galleryKeys.creationStatus(),
    queryFn: getPhotoCardCreationStatus,
  });
}