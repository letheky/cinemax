"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Film, Search, Bookmark, Home, Menu, X,
  TrendingUp, Flame, Award, Clapperboard, ChevronDown, Grid3X3,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GENRES } from "@/lib/genres";

const exploreLinks = [
  { href: "/trending",    label: "Đang thịnh hành", icon: TrendingUp, desc: "Hot nhất tuần này" },
  { href: "/now-playing", label: "Đang chiếu",       icon: Flame,      desc: "Đang chiếu tại rạp" },
  { href: "/top-rated",   label: "Đánh giá cao",     icon: Award,      desc: "Được yêu thích nhất" },
  { href: "/upcoming",    label: "Sắp ra mắt",       icon: Clapperboard, desc: "Phim sắp ra mắt" },
];

export default function Navbar({ authSlot }: { authSlot?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const exploreRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) setGenreOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setExploreOpen(false);
    setGenreOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ("");
    }
  }

  const isExplorePath = ["/trending", "/now-playing", "/top-rated", "/upcoming"].includes(pathname);
  const isGenrePath = pathname.startsWith("/genre");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0f]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Film className="w-7 h-7 text-yellow-400" />
          <span className="text-xl font-bold tracking-tight">
            Cine<span className="text-yellow-400">Max</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* Trang chủ */}
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Home className="w-4 h-4" />
            Trang chủ
          </Link>

          {/* Khám phá dropdown */}
          <div ref={exploreRef} className="relative">
            <button
              onClick={() => { setExploreOpen(!exploreOpen); setGenreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isExplorePath
                  ? "bg-yellow-400/20 text-yellow-400"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Khám phá
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${exploreOpen ? "rotate-180" : ""}`} />
            </button>
            {exploreOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                {exploreLinks.map(({ href, label, icon: Icon, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                      pathname === href ? "text-yellow-400" : "text-white/80"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-yellow-400/70" />
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-white/40">{desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Thể loại dropdown */}
          <div ref={genreRef} className="relative">
            <button
              onClick={() => { setGenreOpen(!genreOpen); setExploreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isGenrePath
                  ? "bg-yellow-400/20 text-yellow-400"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Thể loại
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${genreOpen ? "rotate-180" : ""}`} />
            </button>
            {genreOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2">
                <div className="grid grid-cols-2 gap-0.5 px-2">
                  {GENRES.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genre/${genre.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors ${
                        pathname === `/genre/${genre.id}` ? "text-yellow-400" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <span>{genre.emoji}</span>
                      <span className="truncate">{genre.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Watchlist */}
          <Link
            href="/watchlist"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/watchlist"
                ? "bg-yellow-400/20 text-yellow-400"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Danh sách
          </Link>
        </div>

        {/* Search desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Tìm phim..."
              className="w-full bg-white/10 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:bg-white/15 transition-all"
            />
          </div>
        </form>

        {/* Auth slot – passed from Server Component layout */}
        {authSlot && (
          <div className="hidden md:block shrink-0">{authSlot}</div>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/98 backdrop-blur-md border-t border-white/10 px-4 py-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSearch} className="mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Tìm phim..."
                className="w-full bg-white/10 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm placeholder-white/40 focus:outline-none focus:border-yellow-400/50"
              />
            </div>
          </form>

          <Link href="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${pathname === "/" ? "bg-yellow-400/20 text-yellow-400" : "text-white/70"}`}>
            <Home className="w-4 h-4" /> Trang chủ
          </Link>

          <p className="text-xs text-white/30 uppercase tracking-wider px-3 pt-2">Khám phá</p>
          {exploreLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${pathname === href ? "bg-yellow-400/20 text-yellow-400" : "text-white/70"}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}

          <p className="text-xs text-white/30 uppercase tracking-wider px-3 pt-2">Thể loại</p>
          <div className="grid grid-cols-2 gap-1">
            {GENRES.map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.id}`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm ${pathname === `/genre/${genre.id}` ? "bg-yellow-400/20 text-yellow-400" : "text-white/60 hover:text-white"}`}
              >
                <span>{genre.emoji}</span> {genre.name}
              </Link>
            ))}
          </div>

          <Link href="/watchlist" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mt-1 ${pathname === "/watchlist" ? "bg-yellow-400/20 text-yellow-400" : "text-white/70"}`}>
            <Bookmark className="w-4 h-4" /> Danh sách của tôi
          </Link>
        </div>
      )}
    </nav>
  );
}
