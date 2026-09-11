"use client";

import Header from "@/components/common/Header/Header";
import RandomPointModal from "@/components/RandomPointModal/RandomPointModal";
import NotificationList from "@/features/notification/components/NotificationList";
import { useState } from "react";
import { useReadAllNotifications } from "@/features/notification/hooks/use-notification";

export default function MainLayout({ children }) {
  const [isRandomPointOpen, setIsRandomPointOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 알림 읽음 일괄 처리
  const {
    mutate: markAllAsRead,
    isPending: isMarkingAsRead,
  } = useReadAllNotifications();

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

  // 삭제 예정
  const mockUser = {
    nickname: "뽀또야",
    points: 650,
  };

  return (
    <>
      <Header
        user={mockUser}
        onRandomBoxClick={openRandomPoint}
        onNotificationClick={toggleNotification}
        onNotificationClose={closeNotification}
        notificationPanel={isNotificationOpen ? <NotificationList /> : null}
        isNotificationDisabled={isMarkingAsRead}
      />
      <main>{children}</main>

      {isRandomPointOpen && <RandomPointModal onClose={closeRandomPoint} />}
    </>
  );
}
