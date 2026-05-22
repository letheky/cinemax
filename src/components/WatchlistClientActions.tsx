"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function WatchlistClientActions({ movieId }: { movieId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRemove() {
    setLoading(true);
    await fetch(`/api/watchlist?movieId=${movieId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="px-3 pb-3">
      <button
        onClick={handleRemove}
        disabled={loading}
        className="w-full flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Xóa khỏi danh sách
      </button>
    </div>
  );
}
