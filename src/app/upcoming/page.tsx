import { tmdb } from "@/lib/tmdb";
import MovieListPage from "@/components/MovieListPage";

interface Props { searchParams: Promise<{ page?: string }> }

export const metadata = { title: "Sắp ra mắt – CineMax" };

export default async function UpcomingPage({ searchParams }: Props) {
  const { page = "1" } = await searchParams;
  const data = await tmdb.getUpcoming(page);
  return (
    <MovieListPage
      title="Sắp ra mắt"
      description="Những bộ phim hot nhất sắp được ra mắt"
      movies={data.results}
      currentPage={Number(page)}
      totalPages={data.total_pages}
      basePath="/upcoming"
    />
  );
}
