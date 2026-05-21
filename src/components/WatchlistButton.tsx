"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist";

export default function WatchlistButton({ movie }: { movie: Movie }) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const inList = isInWatchlist(movie.id);
    setMounted(true);
    setSaved(inList);
  }, [movie.id]);

  function toggle() {
    if (saved) {
      removeFromWatchlist(movie.id);
      setSaved(false);
    } else {
      addToWatchlist(movie);
      setSaved(true);
    }
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium text-sm transition-all ${
        saved
          ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 hover:bg-yellow-400/30"
          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
      }`}
    >
      {saved ? (
        <>
          <BookmarkCheck className="w-4 h-4" />
          Đã lưu
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Lưu phim
        </>
      )}
    </button>
  );
}
