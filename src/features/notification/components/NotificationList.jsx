import styles from "./NotificationList.module.css";
import NotificationItem from "./NotificationItem.jsx";
import { MOCK_NOTIFICATION_RESPONSE } from "../notification-mock.js";

export default function NotificationList() {
  const notifications = MOCK_NOTIFICATION_RESPONSE.items;

  return (
    <div className={styles.wrapper}>
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
