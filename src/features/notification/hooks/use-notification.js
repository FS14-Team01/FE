import { notificationKeys } from "@/lib/query-keys";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../api/notification-api";

// 알림 목록 가져오기
export function useGetNotifications({ isRead, limit }) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list({ isRead, limit }),
    queryFn: ({ pageParam }) =>
      getNotifications({ isRead, cursor: pageParam, limit }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

// 알림 읽음 일괄 처리
export function useReadAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}
