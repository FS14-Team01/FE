import MobilePageHeader from "@/components/common/MobilePageHeader/MobilePageHeader";
import NotificationList from "@/features/notification/components/NotificationList";

export default function NotificationsPage() {
  return (
    <>
      <MobilePageHeader title="알림" />
      <main>
        <NotificationList variant="page" />
      </main>
    </>
  );
}
