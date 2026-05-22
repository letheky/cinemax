import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ saved: false });

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  if (!movieId) return NextResponse.json({ saved: false });

  try {
    const item = await db.watchlist.findUnique({
      where: { userId_movieId: { userId: session.user.id, movieId } },
    });
    return NextResponse.json({ saved: !!item });
  } catch {
    return NextResponse.json({ saved: false });
  }
}
