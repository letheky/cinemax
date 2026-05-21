const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieDetails extends Movie {
  credits: { cast: CastMember[] };
  videos: { results: Video[] };
  similar: { results: Movie[] };
}

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY!);
  url.searchParams.set("language", "vi-VN");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

export const tmdb = {
  getTrending: (page = "1") =>
    fetchTMDB<PaginatedResponse<Movie>>("/trending/movie/week", { page }),

  getPopular: (page = "1") =>
    fetchTMDB<PaginatedResponse<Movie>>("/movie/popular", { page }),

  getTopRated: (page = "1") =>
    fetchTMDB<PaginatedResponse<Movie>>("/movie/top_rated", { page }),

  getNowPlaying: (page = "1") =>
    fetchTMDB<PaginatedResponse<Movie>>("/movie/now_playing", { page }),

  getUpcoming: (page = "1") =>
    fetchTMDB<PaginatedResponse<Movie>>("/movie/upcoming", { page }),

  getMovieDetails: (id: string) =>
    fetchTMDB<MovieDetails>(`/movie/${id}`, {
      append_to_response: "credits,videos,similar",
    }),

  searchMovies: (query: string, page = "1") =>
    fetchTMDB<PaginatedResponse<Movie>>("/search/movie", { query, page }),

  getGenres: () =>
    fetchTMDB<{ genres: Genre[] }>("/genre/movie/list"),

  getByGenre: (genreId: string, page = "1") =>
    fetchTMDB<PaginatedResponse<Movie>>("/discover/movie", {
      with_genres: genreId,
      sort_by: "popularity.desc",
      page,
    }),
};

export function getPosterUrl(path: string | null, size = "w500") {
  if (!path) return "/no-poster.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size = "w1280") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}
