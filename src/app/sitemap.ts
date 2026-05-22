import type { MetadataRoute } from "next";
import { GENRES } from "@/lib/genres";
import { tmdb } from "@/lib/tmdb";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://cinemax.vercel.app";

// ── Static pages ──────────────────────────────────────────────────────────────
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    changeFrequency: "daily",
    priority: 1.0,
    lastModified: new Date(),
  },
  {
    url: `${BASE_URL}/trending`,
    changeFrequency: "daily",
    priority: 0.9,
    lastModified: new Date(),
  },
  {
    url: `${BASE_URL}/now-playing`,
    changeFrequency: "daily",
    priority: 0.9,
    lastModified: new Date(),
  },
  {
    url: `${BASE_URL}/top-rated`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: new Date(),
  },
  {
    url: `${BASE_URL}/upcoming`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: new Date(),
  },
  {
    url: `${BASE_URL}/search`,
    changeFrequency: "monthly",
    priority: 0.5,
    lastModified: new Date(),
  },
];

// ── Genre pages ───────────────────────────────────────────────────────────────
const genreRoutes: MetadataRoute.Sitemap = GENRES.map((genre) => ({
  url: `${BASE_URL}/genre/${genre.id}`,
  changeFrequency: "weekly" as const,
  priority: 0.7,
  lastModified: new Date(),
}));

// ── Dynamic movie pages (trending + top-rated) ────────────────────────────────
async function getMovieRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const [trending, topRated, nowPlaying] = await Promise.all([
      tmdb.getTrending("1"),
      tmdb.getTopRated("1"),
      tmdb.getNowPlaying("1"),
    ]);

    const seen = new Set<number>();
    const movies = [...trending.results, ...topRated.results, ...nowPlaying.results].filter(
      (m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      }
    );

    return movies.map((movie) => ({
      url: `${BASE_URL}/movie/${movie.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: movie.release_date ? new Date(movie.release_date) : new Date(),
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movieRoutes = await getMovieRoutes();
  return [...staticRoutes, ...genreRoutes, ...movieRoutes];
}
