import ResponsiveHeader from '@/components/common/ResponsiveHeader/ResponsiveHeader'

export default function CreatePhotoCardLayout({ children }) {
  return (
    <>
      <ResponsiveHeader title="알림" />
      <main>{children}</main>
    </>
  )
}
