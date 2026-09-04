import Header from '@/components/common/Header/Header'

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
