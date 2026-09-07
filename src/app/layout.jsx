import './globals.css';
import Provider from "@/providers/provider";
export const metadata = {
  title: '최애의 포토',
};

export default function RootLayout({ children }) {
  return (
    <html lang='ko'>
      <body>
        <Provider>
          {children}
        </Provider>
import { ToastProvider } from '@/components/common/Toast/ToastProvider'
import Footer from '@/components/common/Footer/Footer'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
