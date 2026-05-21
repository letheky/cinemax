import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
        <footer className="border-t border-white/10 mt-20 py-8 text-center text-sm text-white/40">
          © 2025 CineMax · Dữ liệu từ{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:underline"
          >
            TMDB
          </a>
        </footer>
      </body>
    </html>
  );
}
