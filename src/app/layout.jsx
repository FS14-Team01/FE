import Footer from "@/components/common/Footer/Footer";
import { ToastProvider } from "@/components/common/Toast/ToastProvider";
import Provider from "@/providers/provider";
import "./globals.css";

export const metadata = {
  title: "최애의 포토",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Provider>
          <ToastProvider>
            {children}
            <Footer />
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
