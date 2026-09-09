import styles from "./NotificationList.module.css";
import NotificationItem from "./NotificationItem.jsx";
import { MOCK_NOTIFICATION_RESPONSE } from "../notification-mock.js";

export default function NotificationList({ variant = "popover" }) {
  const notifications = MOCK_NOTIFICATION_RESPONSE.items;
  const variantClassName = variant === "page" ? styles.page : styles.popover;

  return (
    <div className={`${styles.wrapper} ${variantClassName}`}>
      <ul className={styles.list}>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <NotificationItem notification={notification} />
          </li>
        ))}
      </ul>
    </div>
  );
}
