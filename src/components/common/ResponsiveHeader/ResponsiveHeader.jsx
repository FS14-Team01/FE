"use client";

import AuthHeader from "../AuthHeader/AuthHeader";
import MobilePageHeader from "@/components/common/MobilePageHeader/MobilePageHeader";
import styles from "./ResponsiveHeader.module.css";

export default function ResponsiveHeader({ title, onNotificationClick }) {
  return (
    <>
      <div className={styles.defaultHeader}>
        <AuthHeader onNotificationClick={onNotificationClick} />
      </div>
      <div className={styles.mobileHeader}>
        <MobilePageHeader title={title} />
      </div>
    </>
  );
}
