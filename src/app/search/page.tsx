import { tmdb } from "@/lib/tmdb";
import Link from "next/link";
import { Search } from "lucide-react";

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
      {q && !results && (
        <p className="text-white/50">Đang tìm kiếm...</p>
      )}

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
            {results.results.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-yellow-400/40 transition-all hover:scale-[1.03]"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                  {movie.poster_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-white/20">🎬</div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1">{movie.release_date?.slice(0, 4)}</p>
                </div>
              </Link>
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
