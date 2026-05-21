import Link from "next/link";
import { Film, Mail, Globe, TrendingUp, Flame, Award, Clapperboard, Search, Bookmark } from "lucide-react";
import { GENRES } from "@/lib/genres";

const exploreLinks = [
  { href: "/trending",    label: "Đang thịnh hành", icon: TrendingUp },
  { href: "/now-playing", label: "Đang chiếu",       icon: Flame },
  { href: "/top-rated",   label: "Đánh giá cao",     icon: Award },
  { href: "/upcoming",    label: "Sắp ra mắt",       icon: Clapperboard },
  { href: "/search",      label: "Tìm kiếm",         icon: Search },
  { href: "/watchlist",   label: "Danh sách của tôi", icon: Bookmark },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 bg-[#080810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Film className="w-7 h-7 text-yellow-400" />
              <span className="text-xl font-bold">
                Cine<span className="text-yellow-400">Max</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              Nền tảng khám phá phim trực tuyến. Tra cứu thông tin, xem trailer và lưu danh sách phim yêu thích của bạn.
            </p>
            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2">
              {["Next.js 15", "TypeScript", "Tailwind CSS"].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Khám phá</h3>
            <ul className="space-y-2.5">
              {exploreLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-yellow-400 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Thể loại</h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-2.5">
              {GENRES.slice(0, 10).map((genre) => (
                <li key={genre.id}>
                  <Link
                    href={`/genre/${genre.id}`}
                    className="flex items-center gap-1.5 text-sm text-white/50 hover:text-yellow-400 transition-colors"
                  >
                    <span className="text-xs">{genre.emoji}</span>
                    <span className="truncate">{genre.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Về sản phẩm</h3>
            <div className="space-y-3 text-sm text-white/50">
              <p className="leading-relaxed">
                Được xây dựng bởi{" "}
                <span className="text-white/80 font-medium">letheky</span> · Dữ liệu phim cung cấp bởi{" "}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  TMDB API
                </a>
              </p>
              <p className="text-xs text-white/30 leading-relaxed">
                Ứng dụng chỉ mang tính chất tham khảo và học tập. Không cung cấp dịch vụ phát trực tuyến.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://github.com/letheky/cinemax"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                {/* GitHub icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="mailto:thekyle997@gmail.com"
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                Liên hệ
              </a>
            </div>

            {/* TMDB attribution */}
            <div className="mt-5 flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <Globe className="w-4 h-4 text-white/30 shrink-0" />
              <p className="text-xs text-white/30">
                Dữ liệu từ{" "}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400/70 hover:text-yellow-400"
                >
                  The Movie Database
                </a>
                {" "}– không phải sản phẩm của TMDB
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} CineMax. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Powered by{" "}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Next.js
            </a>
            {" "}·{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
