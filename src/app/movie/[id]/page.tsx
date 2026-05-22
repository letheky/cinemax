import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Clock, Calendar, DollarSign, Users } from "lucide-react";
import { tmdb, getBackdropUrl, getPosterUrl, IMAGE_BASE } from "@/lib/tmdb";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import WatchlistButton from "@/components/WatchlistButton";
import ReviewSection from "@/components/ReviewSection";
import MovieCard from "@/components/MovieCard";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const movie = await tmdb.getMovieDetails(id);
    return { title: `${movie.title} – CineMax`, description: movie.overview?.slice(0, 160) };
  } catch {
    return { title: "CineMax" };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetch TMDB data + auth in parallel
  let movie;
  try {
    movie = await tmdb.getMovieDetails(id);
  } catch {
    notFound();
  }

  const session = await auth();
  const currentUserId = session?.user?.id;
  const movieId = String(movie.id);

  // Fetch reviews + watchlist status in parallel (both need movieId)
  const [reviewsRaw, watchlistItem] = await Promise.all([
    db.review.findMany({
      where: { movieId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    }),
    currentUserId
      ? db.watchlist.findUnique({
          where: { userId_movieId: { userId: currentUserId, movieId } },
        })
      : Promise.resolve(null),
  ]);

  // Normalise Date → string so the Client Component can receive it via props
  const initialReviews = reviewsRaw.map((r) => ({
    id: r.id,
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
    user: r.user,
  }));
  const initialSaved = !!watchlistItem;

  const backdrop = getBackdropUrl(movie.backdrop_path);
  const poster = getPosterUrl(movie.poster_path, "w342");
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}g ${movie.runtime % 60}ph`
    : null;

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const similar = movie.similar?.results?.slice(0, 6) || [];

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[50vh] overflow-hidden">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-40 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Poster */}
          <div className="shrink-0">
            {movie.poster_path ? (
              <Image
                src={poster}
                alt={movie.title}
                width={342}
                height={513}
                priority
                sizes="(max-width: 640px) 160px, 208px"
                className="w-40 sm:w-52 rounded-xl shadow-2xl border border-white/10"
              />
            ) : (
              <div className="w-40 sm:w-52 aspect-[2/3] rounded-xl bg-white/10 flex items-center justify-center text-4xl">🎬</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 sm:pt-20">
            {movie.tagline && (
              <p className="text-yellow-400/80 text-sm italic mb-2">{movie.tagline}</p>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{movie.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-4">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{movie.vote_average?.toFixed(1)}</span>
                <span>({movie.vote_count?.toLocaleString()} đánh giá)</span>
              </span>
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {runtime}
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-full transition-colors text-sm"
                >
                  ▶ Xem trailer
                </a>
              )}
              <WatchlistButton movieId={movieId} initialSaved={initialSaved} />
            </div>
          </div>
        </div>

        {/* Stats */}
        {(movie.budget || movie.revenue) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {movie.budget ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                  <DollarSign className="w-3.5 h-3.5" /> Kinh phí
                </div>
                <p className="font-semibold">${movie.budget.toLocaleString()}</p>
              </div>
            ) : null}
            {movie.revenue ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                  <DollarSign className="w-3.5 h-3.5" /> Doanh thu
                </div>
                <p className="font-semibold">${movie.revenue.toLocaleString()}</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-400" /> Diễn viên
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {cast.map((member) => (
                <div key={member.id} className="shrink-0 w-24 text-center">
                  <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-white/10 border border-white/10 mb-2">
                    {member.profile_path ? (
                      <Image
                        src={`${IMAGE_BASE}/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{member.name}</p>
                  <p className="text-xs text-white/40 line-clamp-1">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews – list pre-fetched server-side, form still interactive */}
        <ReviewSection
          movieId={movieId}
          currentUserId={currentUserId}
          initialReviews={initialReviews}
        />

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold mb-4">Phim tương tự</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
