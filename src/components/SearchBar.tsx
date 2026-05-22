"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Star, Loader2, X } from "lucide-react";
import { Movie, IMAGE_BASE } from "@/lib/tmdb";

interface Props {
  /** Compact desktop pill or chunkier mobile input */
  variant?: "desktop" | "mobile";
  /** Optional callback fired when the user navigates to a result — used to close the mobile menu */
  onNavigate?: () => void;
}

export default function SearchBar({ variant = "desktop", onNavigate }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search — 300ms after typing stops
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    setOpen(true);
    setLoading(true);

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults((data.results ?? []).slice(0, 6));
        setLoading(false);
      } catch (err) {
        // Ignore aborts (newer query took over); real errors → empty list
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on outside click / Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Clear when the route changes
  useEffect(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, [pathname]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function closeAndNavigate() {
    setOpen(false);
    setQuery("");
    onNavigate?.();
  }

  function clearQuery() {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  const isMobile = variant === "mobile";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setOpen(true)}
            placeholder="Tìm phim..."
            role="combobox"
            aria-label="Tìm phim"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={open}
            className={`w-full bg-white/[0.07] border border-white/[0.08] rounded-full pl-9 ${
              query ? "pr-9" : "pr-4"
            } text-sm placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all ${
              isMobile ? "py-2.5" : "py-1.5"
            }`}
          />
          {loading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 animate-spin pointer-events-none" />
          ) : query ? (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Xóa nội dung tìm kiếm"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div
          id="search-results"
          role="listbox"
          className={`absolute top-full mt-2 bg-[#111118] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 ${
            isMobile ? "left-0 right-0" : "right-0 w-[380px] max-w-[calc(100vw-2rem)]"
          }`}
        >
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="py-6 px-4 text-center text-white/40 text-sm">
              Không tìm thấy <span className="text-white/70">&quot;{query.trim()}&quot;</span>
            </div>
          ) : (
            <>
              <div className="max-h-[70vh] overflow-y-auto p-1.5">
                {results.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    onClick={closeAndNavigate}
                    role="option"
                    className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="relative w-10 h-14 shrink-0 rounded-md overflow-hidden bg-black/30">
                      {movie.poster_path ? (
                        <Image
                          src={`${IMAGE_BASE}/w92${movie.poster_path}`}
                          alt=""
                          width={40}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-base">🎬</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/90 group-hover:text-yellow-400 transition-colors line-clamp-1">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                        {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
                        {movie.vote_average ? (
                          <>
                            {movie.release_date && <span aria-hidden>·</span>}
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              {movie.vote_average.toFixed(1)}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {query.trim() && (
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={closeAndNavigate}
                  className="block py-2.5 text-center text-xs text-yellow-400 hover:bg-white/5 border-t border-white/[0.06] transition-colors"
                >
                  Xem tất cả kết quả cho &quot;{query.trim()}&quot;
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
