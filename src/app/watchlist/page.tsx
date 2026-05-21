"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Star, Trash2, Film } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const list = getWatchlist();
    setMounted(true);
    setMovies(list);
  }, []);

  function handleRemove(id: number) {
    removeFromWatchlist(id);
    setMovies((prev) => prev.filter((m) => m.id !== id));
  }

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <Bookmark className="w-7 h-7 text-yellow-400 fill-yellow-400" />
        Danh sách của tôi
      </h1>
      <p className="text-white/50 text-sm mb-8">{movies.length} bộ phim đã lưu</p>

      {movies.length === 0 ? (
        <div className="text-center py-24">
          <Film className="w-16 h-16 mx-auto text-white/20 mb-4" />
          <p className="text-xl text-white/50">Danh sách trống</p>
          <p className="text-white/30 mt-2 mb-6">Lưu phim yêu thích để xem lại sau</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            Khám phá phim
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all"
            >
              <Link href={`/movie/${movie.id}`} className="flex gap-3 p-3">
                <div className="shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-white/10">
                  {movie.poster_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-white/50 mb-2">
                    {movie.release_date?.slice(0, 4)}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-semibold">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-2 line-clamp-2">{movie.overview}</p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  onClick={() => handleRemove(movie.id)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa khỏi danh sách
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
