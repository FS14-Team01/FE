"use client";

import { useEffect, useRef } from "react";
import { useGetNotifications } from "../hooks/use-notification";
import NotificationItem from "./NotificationItem.jsx";
import styles from "./NotificationList.module.css";

export default function NotificationList() {
  // 알림 hook 호출
  const {
    data,
    isPending,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
  } = useGetNotifications({ limit: 20 });

  // 무한 스크롤
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (
      sentinelRef.current == null ||
      !hasNextPage ||
      isFetching ||
      isFetchNextPageError
    ) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });
    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchNextPageError]);

  // 팝업 안에 보여줄 내용 설정
  let content;

  if (isPending) {
    content = (
      <div className={styles.statusContainer}>
        <p>목록을 불러오는 중입니다.</p>
      </div>
    );
  } else if (isError && !data) {
    content = (
      <div className={styles.statusContainer}>
        <p>목록을 불러오지 못했습니다.</p>
        <button
          className={styles.retryBtn}
          type="button"
          onClick={() => refetch()}
        >
          다시 시도
        </button>
      </div>
    );
  } else {
    const notifications = data.pages.flatMap((page) => page.items);

    if (notifications.length === 0) {
      content = (
        <div className={styles.statusContainer}>
          <p>알림이 없습니다.</p>
        </div>
      );
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
          {isFetchingNextPage ? (
            <div className={styles.loadMoreStatus}>
              <p>목록을 더 불러오고 있습니다.</p>
            </div>
          ) : isFetchNextPageError ? (
            <div className={styles.loadMoreStatus}>
              <p>목록을 더 불러오지 못했습니다.</p>
              <button
                className={styles.retryBtn}
                type="button"
                onClick={() => fetchNextPage()}
              >
                다시 시도
              </button>
            </div>
          ) : (
            hasNextPage && <div className={styles.sentinel} ref={sentinelRef} />
          )}
        </>
      );
    }
  }

  return <div className={styles.wrapper}>{content}</div>;
}
