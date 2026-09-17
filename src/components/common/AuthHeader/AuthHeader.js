"use client";

import Header from "@/components/common/Header/Header";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import NotificationList from "@/features/notification/components/NotificationList";
import {
  useGetNotifications,
  useReadAllNotifications,
} from "@/features/notification/hooks/use-notification";
import RandomPointModal from "@/features/point/components/RandomPoint/RandomPointModal";
import { useGetPoints } from "@/features/point/hooks/use-point";
import { useRandomPointRefresh } from "@/features/point/hooks/use-random-point-refresh";
import { useEffect, useState } from "react";

export default function AuthHeader() {
  useRandomPointRefresh();

  const [isRandomPointOpen, setIsRandomPointOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  // 유저 포인트 조회
  const { data: pointData } = useGetPoints();

  // 읽지 않은 알림 존재 여부 조회
  const { data: unreadNotifications } = useGetNotifications({
    isRead: false,
    limit: 1,
  });

  // 알림 읽음 일괄 처리
  const { mutate: markAllAsRead, isPending: isMarkingAsRead } =
    useReadAllNotifications();

  const points = pointData?.points ?? user?.points ?? 0;
  const canUseRandomBox = pointData?.canUseRandomBox ?? false;
  const hasUnreadNotifications =
    (unreadNotifications?.pages?.[0]?.items?.length ?? 0) > 0;

  function handleLogout() {
    if (logoutMutation.isPending) {
      return;
    }
    logoutMutation.mutate();
  }

  function handleNotificationClick() {
    if (isNotificationOpen) {
      handleNotificationClose();
      return;
    }

    setIsNotificationOpen(true);
  }

  function handleNotificationClose() {
    setIsNotificationOpen(false);
    markAllAsRead();
  }

  function openRandomPoint() {
    setIsRandomPointOpen(true);
  }

  function closeRandomPoint() {
    setIsRandomPointOpen(false);
  }

  // 모바일 알림창이 열린 동안 배경 스크롤 방지
  useEffect(() => {
    if (!isNotificationOpen) return undefined;

    const mediaQuery = window.matchMedia("(max-width: 743px)");
    const previousOverflow = document.body.style.overflow;

    const handleScreenChange = (event) => {
      const { matches } = event;
      document.body.style.overflow = matches ? "hidden" : previousOverflow;
    };

    handleScreenChange(mediaQuery);
    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
      document.body.style.overflow = previousOverflow;
    };
  }, [isNotificationOpen]);

  return (
    <>
      <Header
        user={user ?? null}
        points={points}
        canUseRandomBox={canUseRandomBox}
        onLogout={handleLogout}
        onRandomBoxClick={openRandomPoint}
        onNotificationClick={handleNotificationClick}
        onNotificationClose={handleNotificationClose}
        notificationPanel={isNotificationOpen ? <NotificationList /> : null}
        isNotificationDisabled={isMarkingAsRead}
        hasUnreadNotifications={hasUnreadNotifications}
      />
      {isRandomPointOpen && <RandomPointModal onClose={closeRandomPoint} />}
    </>
  );
}
