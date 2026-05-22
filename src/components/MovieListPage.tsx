import Link from "next/link";
import { Movie } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

interface Props {
  title: string;
  description?: string;
  accentColor?: string;
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function MovieListPage({ title, description, accentColor, movies, currentPage, totalPages, basePath }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <div className="mb-8 flex items-center gap-3">
        {accentColor && (
          <span className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
        )}
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-white/50 text-sm mt-1">{description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} priority={i < 12} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {currentPage > 1 && (
            <Link
              href={`${basePath}?page=${currentPage - 1}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
            >
              ← Trước
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-white/50">
            Trang {currentPage} / {Math.min(totalPages, 500)}
          </span>
          {currentPage < totalPages && currentPage < 500 && (
            <Link
              href={`${basePath}?page=${currentPage + 1}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
            >
              Sau →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
