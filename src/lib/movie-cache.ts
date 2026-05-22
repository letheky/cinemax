import { db } from "./db";
import { tmdb, Movie as TmdbMovie } from "./tmdb";

/** Upsert a TMDB movie into our DB (cache). Returns DB movie. */
export async function upsertMovie(tmdbMovie: TmdbMovie) {
  return db.movie.upsert({
    where: { id: String(tmdbMovie.id) },
    update: {
      title: tmdbMovie.title,
      overview: tmdbMovie.overview ?? null,
      posterPath: tmdbMovie.poster_path ?? null,
      backdropPath: tmdbMovie.backdrop_path ?? null,
      releaseDate: tmdbMovie.release_date ?? null,
      voteAverage: tmdbMovie.vote_average ?? null,
      voteCount: tmdbMovie.vote_count ?? null,
      genres: (tmdbMovie.genres ?? tmdbMovie.genre_ids ?? null) as object,
    },
    create: {
      id: String(tmdbMovie.id),
      title: tmdbMovie.title,
      overview: tmdbMovie.overview ?? null,
      posterPath: tmdbMovie.poster_path ?? null,
      backdropPath: tmdbMovie.backdrop_path ?? null,
      releaseDate: tmdbMovie.release_date ?? null,
      voteAverage: tmdbMovie.vote_average ?? null,
      voteCount: tmdbMovie.vote_count ?? null,
      genres: (tmdbMovie.genres ?? tmdbMovie.genre_ids ?? null) as object,
    },
  });
}

/** Fetch movie detail from TMDB, cache it, return merged object */
export async function getOrFetchMovie(id: string) {
  // Try DB first (cached within last 24h)
  const cached = await db.movie.findUnique({ where: { id } });
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (cached && cached.cachedAt > dayAgo) return cached;

  // Fetch from TMDB and update cache
  const movie = await tmdb.getMovieDetails(id);
  const updated = await db.movie.upsert({
    where: { id },
    update: {
      title: movie.title,
      overview: movie.overview ?? null,
      posterPath: movie.poster_path ?? null,
      backdropPath: movie.backdrop_path ?? null,
      releaseDate: movie.release_date ?? null,
      voteAverage: movie.vote_average ?? null,
      voteCount: movie.vote_count ?? null,
      runtime: movie.runtime ?? null,
      genres: (movie.genres ?? null) as object,
    },
    create: {
      id,
      title: movie.title,
      overview: movie.overview ?? null,
      posterPath: movie.poster_path ?? null,
      backdropPath: movie.backdrop_path ?? null,
      releaseDate: movie.release_date ?? null,
      voteAverage: movie.vote_average ?? null,
      voteCount: movie.vote_count ?? null,
      runtime: movie.runtime ?? null,
      genres: (movie.genres ?? null) as object,
    },
  });
  return updated;
}
