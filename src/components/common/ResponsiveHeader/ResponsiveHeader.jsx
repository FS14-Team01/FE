'use client';

import Header from '@/components/common/Header/Header';
import MobilePageHeader from '@/components/common/MobilePageHeader/MobilePageHeader';
import styles from './ResponsiveHeader.module.css';

export default function ResponsiveHeader({
  title,
  user = null,
  onLogout,
  onNotificationClick,
}) {
  return (
    <>
      <div className={styles.defaultHeader}>
        <Header
          user={user}
          onLogout={onLogout}
          onNotificationClick={onNotificationClick}
        />
      </div>
      <div className={styles.mobileHeader}>
        <MobilePageHeader title={title} />
      </div>
    </>
  );
}
