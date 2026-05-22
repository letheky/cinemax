import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { upsertMovie } from "@/lib/movie-cache";
import { tmdb } from "@/lib/tmdb";

// GET /api/watchlist – lấy watchlist của user đang đăng nhập
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.watchlist.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(items.map((i: { movie: unknown }) => i.movie));
}

// POST /api/watchlist – thêm phim vào watchlist
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId } = await req.json();
  if (!movieId) return NextResponse.json({ error: "movieId required" }, { status: 400 });

  // Đảm bảo movie tồn tại trong DB (cache từ TMDB)
  const tmdbMovie = await tmdb.getMovieDetails(String(movieId));
  await upsertMovie(tmdbMovie);

  const item = await db.watchlist.upsert({
    where: { userId_movieId: { userId: session.user.id, movieId: String(movieId) } },
    update: {},
    create: { userId: session.user.id, movieId: String(movieId) },
  });

  return NextResponse.json(item, { status: 201 });
}

// DELETE /api/watchlist?movieId=xxx – xóa khỏi watchlist
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  if (!movieId) return NextResponse.json({ error: "movieId required" }, { status: 400 });

  await db.watchlist.deleteMany({
    where: { userId: session.user.id, movieId },
  });

  return NextResponse.json({ success: true });
}
