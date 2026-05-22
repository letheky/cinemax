import Image from "next/image";
import Link from "next/link";
import { Star, Play, Info } from "lucide-react";
import { Movie, getBackdropUrl } from "@/lib/tmdb";

export default function HeroBanner({ movie }: { movie: Movie }) {
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {backdrop && (
        <Image
          src={backdrop}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
        />
      )}
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3 text-sm text-white/60">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-semibold">{rating}</span>
              <span>·</span>
              <span>{year}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              {movie.title}
            </h1>
            <p className="text-white/70 text-sm sm:text-base line-clamp-3 mb-6">
              {movie.overview}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2.5 rounded-full transition-colors"
              >
                <Play className="w-4 h-4 fill-black" />
                Xem ngay
              </Link>
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-full text-sm transition-colors"
              >
                <Info className="w-4 h-4" />
                Chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
