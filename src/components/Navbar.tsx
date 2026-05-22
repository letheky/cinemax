"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film, Bookmark, Home, Menu, X,
  TrendingUp, Flame, Award, Clapperboard, ChevronDown, LayoutGrid,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GENRES } from "@/lib/genres";
import SearchBar from "@/components/SearchBar";

const exploreLinks = [
  { href: "/trending",    label: "Đang thịnh hành", icon: TrendingUp, desc: "Hot nhất tuần này" },
  { href: "/now-playing", label: "Đang chiếu",       icon: Flame,      desc: "Đang chiếu tại rạp" },
  { href: "/top-rated",   label: "Đánh giá cao",     icon: Award,      desc: "Được yêu thích nhất" },
  { href: "/upcoming",    label: "Sắp ra mắt",       icon: Clapperboard, desc: "Phim sắp ra mắt" },
];

export default function Navbar({ authSlot }: { authSlot?: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const exploreRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) setGenreOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setExploreOpen(false); setGenreOpen(false); }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    setExploreOpen(false);
    setGenreOpen(false);
    setMenuOpen(false);
  }, [pathname]);

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
        <div className="hidden md:flex items-center gap-0.5">

          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/" ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Home className="w-4 h-4" />
            Trang chủ
          </Link>

          {/* Khám phá dropdown */}
          <div ref={exploreRef} className="relative">
            <button
              onClick={() => { setExploreOpen(!exploreOpen); setGenreOpen(false); }}
              aria-haspopup="true"
              aria-expanded={exploreOpen}
              aria-controls="explore-menu"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isExplorePath ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Khám phá
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`} />
            </button>

            {exploreOpen && (
              <div id="explore-menu" role="menu" className="absolute top-full left-0 mt-2 w-52 bg-[#111118] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                <div className="p-1.5">
                  {exploreLinks.map(({ href, label, icon: Icon, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                        pathname === href ? "bg-yellow-400/10 text-yellow-400" : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${pathname === href ? "text-yellow-400" : "text-white/30 group-hover:text-white/60"}`} />
                      <div>
                        <p className="text-sm font-medium leading-tight">{label}</p>
                        <p className="text-xs text-white/35 mt-0.5">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thể loại dropdown */}
          <div ref={genreRef} className="relative">
            <button
              onClick={() => { setGenreOpen(!genreOpen); setExploreOpen(false); }}
              aria-haspopup="true"
              aria-expanded={genreOpen}
              aria-controls="genre-menu"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isGenrePath ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Thể loại
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-200 ${genreOpen ? "rotate-180" : ""}`} />
            </button>

            {genreOpen && (
              <div id="genre-menu" role="menu" className="absolute top-full left-0 mt-2 w-[340px] bg-[#111118] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                <div className="px-3 pt-3 pb-1">
                  <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-2 px-1">
                    Chọn thể loại
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-px px-3 pb-3">
                  {GENRES.map((genre) => {
                    const isActive = pathname === `/genre/${genre.id}`;
                    return (
                      <Link
                        key={genre.id}
                        href={`/genre/${genre.id}`}
                        role="menuitem"
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all group ${
                          isActive ? "bg-white/8" : "hover:bg-white/5"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                          style={{ backgroundColor: genre.color }}
                        />
                        <span className={`text-sm leading-tight ${isActive ? "text-white font-medium" : "text-white/60 group-hover:text-white/90"}`}>
                          {genre.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/watchlist"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/watchlist" ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Danh sách
          </Link>
        </div>

        {/* Search with live results dropdown */}
        <div className="hidden md:flex flex-1 max-w-xs">
          <SearchBar variant="desktop" />
        </div>

        {authSlot && <div className="hidden md:block shrink-0">{authSlot}</div>}

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d14]/98 backdrop-blur-xl border-t border-white/[0.07] px-4 py-4 flex flex-col gap-1 max-h-[85vh] overflow-y-auto">

          <div className="mb-3">
            <SearchBar variant="mobile" onNavigate={() => setMenuOpen(false)} />
          </div>

          <Link href="/"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${pathname === "/" ? "bg-white/8 text-white" : "text-white/60"}`}
          >
            <Home className="w-4 h-4" /> Trang chủ
          </Link>

          {/* Explore section */}
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 pt-3 pb-1">Khám phá</p>
          {exploreLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${pathname === href ? "bg-white/8 text-white" : "text-white/60"}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}

          {/* Genre section */}
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 pt-3 pb-1">Thể loại</p>
          <div className="grid grid-cols-2 gap-px">
            {GENRES.map((genre) => {
              const isActive = pathname === `/genre/${genre.id}`;
              return (
                <Link key={genre.id} href={`/genre/${genre.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm ${isActive ? "bg-white/8 text-white font-medium" : "text-white/55"}`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: genre.color }} />
                  {genre.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/[0.06] mt-2 pt-2">
            <Link href="/watchlist"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${pathname === "/watchlist" ? "bg-white/8 text-white" : "text-white/60"}`}
            >
              <Bookmark className="w-4 h-4" /> Danh sách của tôi
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
