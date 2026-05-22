import { tmdb } from "@/lib/tmdb";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";
import { TrendingUp, Award, Clapperboard, Flame, ChevronRight } from "lucide-react";

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
    { title: "Đang chiếu",      icon: Flame,       movies: nowPlaying.results.slice(0, 12), href: "/now-playing" },
    { title: "Đánh giá cao",    icon: Award,       movies: topRated.results.slice(0, 12),   href: "/top-rated" },
    { title: "Sắp ra mắt",      icon: Clapperboard, movies: upcoming.results.slice(0, 12), href: "/upcoming" },
  ];

  return (
    <>
      <HeroBanner movie={hero} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {sections.map(({ title, icon: Icon, movies, href }) => (
          <section key={title}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Icon className="w-5 h-5 text-yellow-400" />
                {title}
              </h2>
              <Link
                href={href}
                className="flex items-center gap-1 text-sm text-white/40 hover:text-yellow-400 transition-colors"
              >
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} priority={i < 6} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
