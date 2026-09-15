"use client";

import Header from "@/components/common/Header/Header";
import NotificationList from "@/features/notification/components/NotificationList";
import {
  useGetNotifications,
  useReadAllNotifications,
} from "@/features/notification/hooks/use-notification";
import RandomPointModal from "@/features/point/components/RandomPoint/RandomPointModal";
import { useGetPoints } from "@/features/point/hooks/use-point";
import { useRandomPointRefresh } from "@/features/point/hooks/use-random-point-refresh";
import { useState } from "react";

export default function MainLayout({ children }) {
  useRandomPointRefresh();

  const [isRandomPointOpen, setIsRandomPointOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 읽지 않은 알림 존재 여부 조회
  const { data: unreadNotifications } = useGetNotifications({
    isRead: false,
    limit: 1,
  });

  const hasUnreadNotifications =
    (unreadNotifications?.pages?.[0]?.items?.length ?? 0) > 0;

  // 알림 읽음 일괄 처리
  const { mutate: markAllAsRead, isPending: isMarkingAsRead } =
    useReadAllNotifications();

  // 이벤트 핸들러
  const openRandomPoint = () => setIsRandomPointOpen(true);
  const closeRandomPoint = () => setIsRandomPointOpen(false);
  const openNotification = () => setIsNotificationOpen(true);
  const closeNotification = () => {
    setIsNotificationOpen(false);
    markAllAsRead();
  };
  const toggleNotification = () => {
    if (isNotificationOpen) {
      closeNotification();
    } else {
      openNotification();
    }
  };

  // 유저 포인트 조회 hook
  const { data } = useGetPoints();
  const canUseRandomBox = data?.canUseRandomBox ?? false;
  const points = data?.points ?? 0;

  return (
    <>
      <Header
        points={points}
        canUseRandomBox={canUseRandomBox}
        onRandomBoxClick={openRandomPoint}
        onNotificationClick={toggleNotification}
        onNotificationClose={closeNotification}
        notificationPanel={isNotificationOpen ? <NotificationList /> : null}
        isNotificationDisabled={isMarkingAsRead}
        hasUnreadNotifications={hasUnreadNotifications}
      />
      <main>{children}</main>

      {isRandomPointOpen && <RandomPointModal onClose={closeRandomPoint} />}
    </>
  );
}
