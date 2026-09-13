import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPoints, drawRandomPoint } from "../api/point-api";
import { pointKeys } from "@/lib/query-keys";

// 유저 포인트 조회
export function useGetPoints() {
  return useQuery({
    queryKey: pointKeys.me(),
    queryFn: getPoints,
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
  });
}
