"use client";

import Header from "@/components/common/Header/Header";
import RandomPointModal from "@/features/point/components/RandomPoint/RandomPointModal";
import NotificationList from "@/features/notification/components/NotificationList";
import { useState } from "react";

export default function MainLayout({ children }) {
  const [isRandomPointOpen, setIsRandomPointOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const openRandomPoint = () => setIsRandomPointOpen(true);
  const closeRandomPoint = () => setIsRandomPointOpen(false);
  const closeNotification = () => setIsNotificationOpen(false);
  const toggleNotification = () => setIsNotificationOpen((current) => !current);

  const mockUser = {
    nickname: "뽀또야",
    points: 450,
  };

  return (
    <>
      <Header
        user={mockUser}
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
