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
      </body>
    </html>
  );
}
