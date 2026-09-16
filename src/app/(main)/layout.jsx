"use client";

import AuthHeader from "@/components/common/AuthHeader/AuthHeader";
import NotificationList from "@/features/notification/components/NotificationList";
import RandomPointModal from "@/features/point/components/RandomPoint/RandomPointModal";
import { useGetPoints } from "@/features/point/hooks/use-point";
import { useRandomPointRefresh } from "@/features/point/hooks/use-random-point-refresh";
import { useState } from "react";

export default function MainLayout({ children }) {
  useRandomPointRefresh();

  const [isRandomPointOpen, setIsRandomPointOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const openRandomPoint = () => setIsRandomPointOpen(true);
  const closeRandomPoint = () => setIsRandomPointOpen(false);
  const closeNotification = () => setIsNotificationOpen(false);
  const toggleNotification = () => setIsNotificationOpen((current) => !current);

  // 유저 포인트 조회 hook
  const { data } = useGetPoints();
  const canUseRandomBox = data?.canUseRandomBox ?? false;
  const points = data?.points ?? 0;

  return (
    <>
      <AuthHeader
        points={points}
        canUseRandomBox={canUseRandomBox}
        onRandomBoxClick={openRandomPoint}
        onNotificationClick={toggleNotification}
        onNotificationClose={closeNotification}
        notificationPanel={isNotificationOpen ? <NotificationList /> : null}
      />
      <main>{children}</main>

      {isRandomPointOpen && <RandomPointModal onClose={closeRandomPoint} />}
    </>
  );
}
