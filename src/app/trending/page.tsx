import { tmdb } from "@/lib/tmdb";
import MovieListPage from "@/components/MovieListPage";

interface Props { searchParams: Promise<{ page?: string }> }

export const metadata = { title: "Đang thịnh hành – CineMax" };

export default async function TrendingPage({ searchParams }: Props) {
  const { page = "1" } = await searchParams;
  const data = await tmdb.getTrending(page);
  return (
    <MovieListPage
      title="Đang thịnh hành"
      description="Những bộ phim được xem nhiều nhất tuần này"
      movies={data.results}
      currentPage={Number(page)}
      totalPages={data.total_pages}
      basePath="/trending"
    />
  );
}
