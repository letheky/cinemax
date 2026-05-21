import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Movie, getPosterUrl } from "@/lib/tmdb";

interface Props {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: Props) {
  const year = movie.release_date?.slice(0, 4) || "N/A";
  const rating = movie.vote_average?.toFixed(1) || "0.0";

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-yellow-400/10"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
        <Image
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
          unoptimized
        />
        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span>{rating}</span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-white/50 mt-1">{year}</p>
      </div>
    </Link>
  );
}
