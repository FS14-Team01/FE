import ResponsiveHeader from "@/components/common/ResponsiveHeader/ResponsiveHeader";
import CreatePage from "@/features/create-photo-card/components/CreatePage/createPage";

export default function PhotoCardCreateRoute() {
  return (
    <>
      <ResponsiveHeader title="포토카드 생성" />
      <CreatePage />
    </>
  );
}
