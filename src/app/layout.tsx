import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CineMax – Xem phim trực tuyến",
  description: "Khám phá hàng nghìn bộ phim nổi tiếng",
  openGraph: {
    title: "CineMax",
    description: "Khám phá hàng nghìn bộ phim nổi tiếng",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
