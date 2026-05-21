import MovieCard from "./MovieCard";
import { Movie } from "@/lib/tmdb";

interface Props {
  movies: Movie[];
  title?: string;
}

export default function MovieGrid({ movies, title }: Props) {
  if (!movies.length) {
    return (
      <div className="text-center py-20 text-white/40">
        <p className="text-lg">Không có phim nào.</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-yellow-400 rounded-full inline-block" />
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} priority={i < 6} />
        ))}
      </div>
    </section>
  );
}
