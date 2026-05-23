import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "법흥계곡캠핑오늘",
  description: "강원 영월 법흥계곡 옆 자연 친화적 캠핑장 예약",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
