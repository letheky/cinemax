"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Send, Trash2, Loader2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface Props {
  movieId: string;
  currentUserId?: string;
  /** Pre-fetched on the server — skips the client-side loading state entirely. */
  initialReviews?: Review[];
}

export default function ReviewSection({ movieId, currentUserId, initialReviews }: Props) {
  const myInitial = initialReviews?.find((r) => r.user.id === currentUserId);

  const [reviews, setReviews] = useState<Review[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(initialReviews === undefined);
  // Lazy-initialise form from server data so the form is ready without waiting
  const [rating, setRating] = useState(myInitial?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState(myInitial?.content ?? "");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const myReview = reviews.find((r) => r.user.id === currentUserId);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Only fetch from the API when no server data was provided
  useEffect(() => {
    if (initialReviews !== undefined) return;

    fetch(`/api/reviews?movieId=${movieId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data);
        const mine = data.find((r: Review) => r.user.id === currentUserId);
        if (mine) { setRating(mine.rating); setContent(mine.content ?? ""); }
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, currentUserId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return;
    if (!currentUserId) { router.push("/login"); return; }
    setSubmitting(true);
    const r = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId, rating, content }),
    });
    if (r.status === 401) { router.push("/login"); return; }
    if (r.ok) {
      const updated = await fetch(`/api/reviews?movieId=${movieId}`).then((r) => r.json());
      setReviews(updated);
    }
    setSubmitting(false);
  }

  async function handleDelete() {
    await fetch(`/api/reviews?movieId=${movieId}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.user.id !== currentUserId));
    setRating(0); setContent("");
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          Đánh giá từ cộng đồng
          {reviews.length > 0 && (
            <span className="text-sm text-white/50 font-normal">({reviews.length})</span>
          )}
        </h2>
        {avgRating && (
          <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{avgRating}</span>
            <span className="text-white/40 text-xs">/10</span>
          </div>
        )}
      </div>

      {/* Form đánh giá */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium mb-3">
          {myReview ? "Cập nhật đánh giá của bạn" : "Viết đánh giá"}
        </p>

        {/* Star rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(n)}
              aria-label={`Đánh giá ${n}/10`}
              className="transition-transform hover:scale-125"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  n <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-white/20"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-yellow-400 font-bold text-lg">{rating}/10</span>
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={currentUserId ? "Chia sẻ cảm nhận của bạn về bộ phim..." : "Đăng nhập để viết đánh giá"}
          disabled={!currentUserId}
          rows={3}
          maxLength={2000}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/40 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {content.length > 1800 && (
          <p className="text-xs text-white/40 mt-1 text-right">{content.length}/2000</p>
        )}

        <div className="flex justify-between items-center mt-3">
          {myReview && (
            <button type="button" onClick={handleDelete} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Xóa đánh giá
            </button>
          )}
          <div className="ml-auto flex gap-2">
            {!currentUserId ? (
              <button type="button" onClick={() => router.push("/login")} className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold rounded-full transition-colors">
                Đăng nhập để đánh giá
              </button>
            ) : (
              <button
                type="submit"
                disabled={!rating || submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black text-sm font-semibold rounded-full transition-colors"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {myReview ? "Cập nhật" : "Gửi"}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Danh sách reviews */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-center py-8 text-white/30 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className={`bg-white/5 border rounded-xl p-4 ${review.user.id === currentUserId ? "border-yellow-400/20" : "border-white/10"}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {review.user.image ? (
                    <Image src={review.user.image} alt={review.user.name ?? ""} width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">👤</div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {review.user.name}
                      {review.user.id === currentUserId && <span className="ml-1.5 text-xs text-yellow-400">(bạn)</span>}
                    </p>
                    <p className="text-xs text-white/40">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-400/10 rounded-full px-2.5 py-0.5 shrink-0">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">{review.rating}</span>
                </div>
              </div>
              {review.content && <p className="text-sm text-white/70 leading-relaxed">{review.content}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
