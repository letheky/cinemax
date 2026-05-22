import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, Star, Film } from "lucide-react";
import WatchlistClientActions from "@/components/WatchlistClientActions";

export const metadata = { title: "Danh sách của tôi – CineMax" };

export default async function WatchlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const items = await db.watchlist.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
    orderBy: { addedAt: "desc" },
  });

  const movies = items.map((i: { movie: { id: string; title: string; posterPath: string | null; releaseDate: string | null; voteAverage: number | null; overview: string | null } }) => i.movie);

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
            <div key={movie.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all">
              <Link href={`/movie/${movie.id}`} className="flex gap-3 p-3">
                <div className="shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-white/10">
                  {movie.posterPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
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
                  <p className="text-xs text-white/50 mb-2">{movie.releaseDate?.slice(0, 4)}</p>
                  {movie.voteAverage && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{movie.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                  {movie.overview && (
                    <p className="text-xs text-white/40 mt-1 line-clamp-2">{movie.overview}</p>
                  )}
                </div>
              </Link>
              <WatchlistClientActions movieId={movie.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
