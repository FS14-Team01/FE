import { formatNotificationMessage } from "../utils/notification-message.js";
import { formatNotificationTime } from "../utils/notification-time.js";
import styles from "./NotificationItem.module.css";

export default function NotificationItem({ notification }) {
  return (
    <div
      className={`${styles.wrapper}
        ${notification.isRead ? styles.read : styles.unread}`}
    >
      <p className={styles.message}>
        {formatNotificationMessage(notification)}
      </p>
      <time className={styles.time} dateTime={notification.createdAt}>
        {formatNotificationTime(notification.createdAt)}
      </time>
    </div>
  );
}
