import Header from '@/components/common/Header/Header'
import RandomPointModal from '@/components/RandomPointModal/RandomPointModal'

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <RandomPointModal />
    </>
  )
}
