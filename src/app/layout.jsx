import './globals.css'
import Footer from '@/components/common/Footer/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}
