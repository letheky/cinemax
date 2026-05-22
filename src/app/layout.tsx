import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "CineMax – Xem phim trực tuyến",
  description: "Khám phá hàng nghìn bộ phim nổi tiếng",
  openGraph: {
    title: "CineMax",
    description: "Khám phá hàng nghìn bộ phim nổi tiếng",
    type: "website",
  },
  verification: {
    google: "I0IASFABp7kbNVIRHwVZsHdOlKAWPjqsjFxEeyLbudU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        {/* AuthButton là Server Component, truyền vào Navbar qua slot */}
        <Navbar authSlot={<AuthButton />} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
