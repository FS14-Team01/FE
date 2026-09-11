import styles from "./NotificationItem.module.css";
import { formatNotificationMessage } from "../notification-message.js";
import { formatNotificationTime } from "../notification-time.js";

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
