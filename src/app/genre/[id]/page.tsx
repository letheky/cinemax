import { tmdb } from "@/lib/tmdb";
import MovieListPage from "@/components/MovieListPage";
import { GENRES } from "@/lib/genres";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const genre = GENRES.find((g) => g.id === Number(id));
  return { title: `${genre?.name ?? "Thể loại"} – CineMax` };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page = "1" } = await searchParams;
  const genre = GENRES.find((g) => g.id === Number(id));
  if (!genre) notFound();

  const data = await tmdb.getByGenre(id, page);
  return (
    <MovieListPage
      title={`${genre.emoji} ${genre.name}`}
      description={`Phim thể loại ${genre.name} phổ biến nhất`}
      movies={data.results}
      currentPage={Number(page)}
      totalPages={data.total_pages}
      basePath={`/genre/${id}`}
    />
  );
}
