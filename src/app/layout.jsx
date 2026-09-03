import './globals.css';

export const metadata = {
  title: {
    default: '최애의 포토',
    template: '%s | 최애의 포토',
  },
  description: '나만의 디지털 포토카드를 만들고 거래하는 플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
