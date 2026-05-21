import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  if (!query.trim()) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0, page: 1 });
  }

  try {
    const data = await tmdb.searchMovies(query, page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
