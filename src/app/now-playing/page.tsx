import { tmdb } from "@/lib/tmdb";
import MovieListPage from "@/components/MovieListPage";

interface Props { searchParams: Promise<{ page?: string }> }

export const metadata = { title: "Đang chiếu – CineMax" };

export default async function NowPlayingPage({ searchParams }: Props) {
  const { page = "1" } = await searchParams;
  const data = await tmdb.getNowPlaying(page);
  return (
    <MovieListPage
      title="Đang chiếu"
      description="Phim đang công chiếu tại rạp trên toàn thế giới"
      movies={data.results}
      currentPage={Number(page)}
      totalPages={data.total_pages}
      basePath="/now-playing"
    />
  );
}
