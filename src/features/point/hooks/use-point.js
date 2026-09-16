import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPoints, drawRandomPoint } from "../api/point-api";
import { pointKeys } from "@/lib/query-keys";
import { getAccessToken } from "@/lib/auth-token";

// 유저 포인트 조회
export function useGetPoints() {
  return useQuery({
    queryKey: pointKeys.me(),
    queryFn: getPoints,
    enabled: Boolean(getAccessToken()),
  });
}

// 랜덤 포인트 뽑기
export function useDrawRandomPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: drawRandomPoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pointKeys.me() });
    },
    onError: (error) => {
      if (error.code === "RANDOM_BOX_ALREADY_USED") {
        queryClient.invalidateQueries({ queryKey: pointKeys.me() });
      }
    },
  });
}
