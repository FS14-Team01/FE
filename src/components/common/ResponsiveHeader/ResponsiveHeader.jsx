"use client";

import AuthHeader from "@/components/common/AuthHeader/AuthHeader";
import MobilePageHeader from "@/components/common/MobilePageHeader/MobilePageHeader";
import styles from "./ResponsiveHeader.module.css";

export default function ResponsiveHeader({
  title,
  points,
  canUseRandomBox,
  onRandomBoxClick,
  onNotificationClick,
  onNotificationClose,
  notificationPanel,
}) {
  return (
    <>
      <div className={styles.defaultHeader}>
        <AuthHeader
          points={points}
          canUseRandomBox={canUseRandomBox}
          onRandomBoxClick={onRandomBoxClick}
          onNotificationClick={onNotificationClick}
          onNotificationClose={onNotificationClose}
          notificationPanel={notificationPanel}
        />
      </div>
      <div className={styles.mobileHeader}>
        <MobilePageHeader title={title} />
      </div>
    </>
  );
}
