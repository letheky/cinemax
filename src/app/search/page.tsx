import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { Search } from "lucide-react";
import MovieCard from "@/components/MovieCard";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", page = "1" } = await searchParams;

  let results = null;
  if (q.trim()) {
    results = await tmdb.searchMovies(q.trim(), page);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Search className="w-7 h-7 text-yellow-400" />
        Tìm kiếm phim
      </h1>

      {/* Search form */}
      <form className="mb-10">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Nhập tên phim..."
            autoFocus
            className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-5 py-3 text-base placeholder-white/40 focus:outline-none focus:border-yellow-400/50 focus:bg-white/15 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-1.5 rounded-full text-sm transition-colors"
          >
            Tìm
          </button>
        </div>
      </form>

      {/* Results */}
      {results && results.results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl text-white/60">Không tìm thấy kết quả cho &quot;{q}&quot;</p>
          <p className="text-white/40 mt-2">Thử từ khóa khác nhé!</p>
        </div>
      )}

      {results && results.results.length > 0 && (
        <>
          <p className="text-white/50 text-sm mb-6">
            Tìm thấy <span className="text-white font-semibold">{results.total_results.toLocaleString()}</span> kết quả cho &quot;{q}&quot;
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.results.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} priority={i < 6} />
            ))}
          </div>

          {/* Pagination */}
          {results.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Number(page) > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${Number(page) - 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  ← Trước
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-white/50">
                Trang {page} / {Math.min(results.total_pages, 500)}
              </span>
              {Number(page) < results.total_pages && Number(page) < 500 && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${Number(page) + 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  Sau →
                </Link>
              )}
            </div>
          )}
        </>
      )}

      {!q && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-xl text-white/60">Tìm kiếm bộ phim bạn yêu thích</p>
          <p className="text-white/40 mt-2">Nhập tên phim vào ô tìm kiếm phía trên</p>
        </div>
      )}
    </div>
  );
}
