import { tmdb } from "@/lib/tmdb";
import MovieListPage from "@/components/MovieListPage";

interface Props { searchParams: Promise<{ page?: string }> }

export const metadata = { title: "Đánh giá cao – CineMax" };

export default async function TopRatedPage({ searchParams }: Props) {
  const { page = "1" } = await searchParams;
  const data = await tmdb.getTopRated(page);
  return (
    <MovieListPage
      title="Đánh giá cao nhất"
      description="Những bộ phim được khán giả và giới phê bình yêu thích nhất mọi thời đại"
      movies={data.results}
      currentPage={Number(page)}
      totalPages={data.total_pages}
      basePath="/top-rated"
    />
  );
}
