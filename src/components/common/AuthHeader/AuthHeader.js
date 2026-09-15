"use client";

import Header from "@/components/common/Header/Header";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";

export default function AuthHeader({
  points,
  canUseRandomBox,
  onRandomBoxClick,
  onNotificationClick,
  onNotificationClose,
  notificationPanel,
}) {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  function handleLogout() {
    if (logoutMutation.isPending) {
      return;
    }
    logoutMutation.mutate();
  }

  return (
    <Header
      points={points ?? user?.points ?? 0}
      canUseRandomBox={canUseRandomBox}
      onRandomBoxClick={onRandomBoxClick}
      onNotificationClick={onNotificationClick}
      onNotificationClose={onNotificationClose}
      notificationPanel={notificationPanel}
      user={user ?? null}
      onLogout={handleLogout}
    />
  );
}
