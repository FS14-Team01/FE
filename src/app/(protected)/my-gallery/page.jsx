import ResponsiveHeader from "@/components/common/ResponsiveHeader/ResponsiveHeader";
import MyGalleryPage from "@/features/my-gallery/components/MyGalleryPage/MyGalleryPage";

export default function MyGalleryRoute() {
  return (
    <>
      <ResponsiveHeader title="마이 갤러리" />
      <MyGalleryPage />
    </>
  );
}
