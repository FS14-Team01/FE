"use client";

import Header from "@/components/common/Header/Header";
import RandomPointModal from "@/components/RandomPointModal/RandomPointModal";
import NotificationList from "@/features/notification/components/NotificationList";
import { useState } from "react";

export default function MainLayout({ children }) {
  const [isRandomPointOpen, setIsRandomPointOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const openRandomPoint = () => setIsRandomPointOpen(true);
  const closeRandomPoint = () => setIsRandomPointOpen(false);
  const closeNotification = () => setIsNotificationOpen(false);
  const toggleNotification = () => setIsNotificationOpen((current) => !current);

  return (
    <>
      <Header
        onRandomBoxClick={openRandomPoint}
        onNotificationClick={toggleNotification}
        onNotificationClose={closeNotification}
        notificationPanel={isNotificationOpen ? <NotificationList variant="popover" /> : null}
      />
      <main>{children}</main>

      {isRandomPointOpen && <RandomPointModal onClose={closeRandomPoint} />}
    </>
  );
}
