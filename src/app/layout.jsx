import Footer from "@/components/common/Footer/Footer";
import ScrollToTopButton from "@/components/common/ScrollToTopButton/ScrollToTopButton";
import { ToastProvider } from "@/components/common/Toast/ToastProvider";
import Provider from "@/providers/provider";
import "./globals.css";

export const metadata = {
  title: "최애의 포토",
  description: "나만의 캐릭터 카드를 만들고, 모으고, 교환해 보세요!",
  openGraph: {
    title: "최애의 포토",
    description: "나만의 캐릭터 카드를 만들고, 모으고, 교환해 보세요!",
    siteName: "최애의 포토",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "최애의 포토",
    description: "나만의 캐릭터 카드를 만들고, 모으고, 교환해 보세요!",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Provider>
          <ToastProvider>
            {children}
            <Footer />
            <ScrollToTopButton />
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
