import { tmdb } from "@/lib/tmdb";
import HeroBanner from "@/components/HeroBanner";
import Link from "next/link";
import { TrendingUp, Award, Clapperboard, Flame } from "lucide-react";

export default async function HomePage() {
  const [trending, topRated, nowPlaying, upcoming] = await Promise.all([
    tmdb.getTrending(),
    tmdb.getTopRated(),
    tmdb.getNowPlaying(),
    tmdb.getUpcoming(),
  ]);

  const hero = trending.results[0];

  const sections = [
    { title: "Đang thịnh hành", icon: TrendingUp, movies: trending.results.slice(1, 13), href: "/trending" },
    { title: "Đang chiếu", icon: Flame, movies: nowPlaying.results.slice(0, 12), href: "/now-playing" },
    { title: "Đánh giá cao", icon: Award, movies: topRated.results.slice(0, 12), href: "/top-rated" },
    { title: "Sắp ra mắt", icon: Clapperboard, movies: upcoming.results.slice(0, 12), href: "/upcoming" },
  ];

  return (
    <>
      <HeroBanner movie={hero} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {sections.map(({ title, icon: Icon, movies }) => (
          <section key={title}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Icon className="w-5 h-5 text-yellow-400" />
                {title}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie, i) => {
                const year = movie.release_date?.slice(0, 4) || "N/A";
                const rating = movie.vote_average?.toFixed(1) || "0.0";
                return (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-yellow-400/10"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                      {movie.poster_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          loading={i < 6 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">🎬</div>
                      )}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
                        ⭐ {rating}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-white/50 mt-1">{year}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
