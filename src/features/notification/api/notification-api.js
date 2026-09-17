import apiClient from "@/lib/axios";

async function getNotifications({ isRead, cursor, limit = 20 }) {
  const response = await apiClient.get("/notifications", {
    params: {
      isRead,
      cursor,
      limit,
    },
  });
  const data = response.data;

  return {
    items: data.items,
    nextCursor: data.nextCursor,
    hasNext: data.hasNext,
  };
}

async function markAllNotificationsAsRead() {
  const response = await apiClient.patch("/notifications/read-all");
  const data = response.data;

  return {
    message: data.message,
  };
}

export { getNotifications, markAllNotificationsAsRead };
