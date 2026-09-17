import ResponsiveHeader from "@/components/common/ResponsiveHeader/ResponsiveHeader";
import MySalesPage from "@/features/marketplace/components/MySalesPage/MySalesPage";

export default function MySalesRoute() {
  return (
    <>
      <ResponsiveHeader title="나의 판매 포토카드" />
      <main>
        <MySalesPage />
      </main>
    </>
  );
}
