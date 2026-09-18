import ResponsiveHeader from "@/components/common/ResponsiveHeader/ResponsiveHeader";
import SaleDetailContent from "@/features/marketplace/components/SaleDetailPage/SaleDetailPage";

export default async function SaleDetailRoute({ params }) {
  const { saleId } = await params;

  return (
    <>
      <ResponsiveHeader title="마켓플레이스" />
      <SaleDetailContent saleId={saleId} />
    </>
  );
}
