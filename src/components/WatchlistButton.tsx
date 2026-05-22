"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

interface Props {
  movieId: string;
  /** Passed from the server to skip the client-side check request.
   *  undefined = unknown (will fetch); true/false = already known server-side. */
  initialSaved?: boolean;
}

export default function WatchlistButton({ movieId, initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Server already told us the state — skip the extra network round-trip
    if (initialSaved !== undefined) return;

    fetch(`/api/watchlist/check?movieId=${movieId}`)
      .then((r) => r.json())
      .then((d) => { if (typeof d.saved === "boolean") setSaved(d.saved); })
      .catch(() => {});
  }, [movieId, initialSaved]);

  async function toggle() {
    setLoading(true);
    try {
      if (saved) {
        const r = await fetch(`/api/watchlist?movieId=${movieId}`, { method: "DELETE" });
        if (r.status === 401) { router.push("/login"); return; }
        if (r.ok) setSaved(false);
      } else {
        const r = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId }),
        });
        if (r.status === 401) { router.push("/login"); return; }
        if (r.ok) setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Xóa khỏi danh sách" : "Lưu vào danh sách"}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium text-sm transition-all disabled:opacity-60 ${
        saved
          ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 hover:bg-yellow-400/30"
          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {saved ? "Đã lưu" : "Lưu phim"}
    </button>
  );
}
