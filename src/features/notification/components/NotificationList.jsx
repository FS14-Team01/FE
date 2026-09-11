"use client";

import styles from "./NotificationList.module.css";
import NotificationItem from "./NotificationItem.jsx";
import { useGetNotifications } from "../hooks/use-notification";
import { useEffect, useRef } from "react";

export default function NotificationList() {
  // 알림 hook 호출
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetNotifications({ limit: 20 });

  // 무한 스크롤
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (sentinelRef.current == null || !hasNextPage || isFetchingNextPage)
      return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 팝업 안에 보여줄 내용 설정
  let content;

  if (status === "pending") {
    content = <p>목록을 불러오는 중입니다.</p>;
  } else if (status === "error") {
    content = <p>목록을 불러오지 못했습니다.</p>;
  } else {
    const notifications = data.pages.flatMap((page) => page.items);

    if (notifications.length === 0) {
      content = <p>알림이 없습니다.</p>;
    } else {
      content = (
        <>
          <ul className={styles.list}>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <NotificationItem notification={notification} />
              </li>
            ))}
          </ul>
          {hasNextPage && <div className={styles.sentinel} ref={sentinelRef} />}
        </>
      );
    }
  }

  return <div className={styles.wrapper}>{content}</div>;
}
