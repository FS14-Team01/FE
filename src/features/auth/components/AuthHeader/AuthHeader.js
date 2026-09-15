"use client";

import Header from "@/components/common/Header/Header";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export default function AuthHeader({
  onRandomBoxClick,
  onNotificationClick,
  onNotificationClose,
  notificationPanel,
}) {
  const { data: user } = useCurrentUser();

  return (
    <Header
      onRandomBoxClick={onRandomBoxClick}
      onNotificationClick={onNotificationClick}
      onNotificationClose={onNotificationClose}
      notificationPanel={notificationPanel}
      user={user ?? null}
    />
  );
}
