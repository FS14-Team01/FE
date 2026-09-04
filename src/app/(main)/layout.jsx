import Header from '@/components/common/Header/Header'

// TODO: 인증 기능 연결 후 실제 사용자 정보로 교체
const mockUser = {
  nickname: '유디',
  points: 1540,
}

export default function MainLayout({ children }) {
  return (
    <>
      <Header user={mockUser} />
      <main>{children}</main>
    </>
  )
}
