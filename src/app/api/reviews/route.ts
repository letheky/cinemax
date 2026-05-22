import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { upsertMovie } from "@/lib/movie-cache";
import { tmdb } from "@/lib/tmdb";

// GET /api/reviews?movieId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  if (!movieId) return NextResponse.json({ error: "movieId required" }, { status: 400 });

  try {
    const reviews = await db.review.findMany({
      where: { movieId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/reviews – tạo hoặc cập nhật review
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, rating, content } = await req.json();
  if (!movieId || !rating) return NextResponse.json({ error: "movieId and rating required" }, { status: 400 });
  if (rating < 1 || rating > 10) return NextResponse.json({ error: "Rating must be 1–10" }, { status: 400 });
  if (content && content.length > 2000) return NextResponse.json({ error: "Review too long (max 2000 characters)" }, { status: 400 });

  try {
    // Cache movie nếu chưa có
    const tmdbMovie = await tmdb.getMovieDetails(String(movieId));
    await upsertMovie(tmdbMovie);

    const review = await db.review.upsert({
      where: { userId_movieId: { userId: session.user.id, movieId: String(movieId) } },
      update: { rating, content: content ?? null },
      create: { userId: session.user.id, movieId: String(movieId), rating, content: content ?? null },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}

// DELETE /api/reviews?movieId=xxx
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  if (!movieId) return NextResponse.json({ error: "movieId required" }, { status: 400 });

  try {
    await db.review.deleteMany({
      where: { userId: session.user.id, movieId },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
