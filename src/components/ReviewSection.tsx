"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Send, Trash2, Loader2, Pencil, LogIn } from "lucide-react";

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
  const router = useRouter();
  const myInitial = initialReviews?.find((r) => r.user.id === currentUserId);

  const [reviews, setReviews] = useState<Review[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(initialReviews === undefined);
  const [rating, setRating] = useState(myInitial?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState(myInitial?.content ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const myReview = reviews.find((r) => r.user.id === currentUserId);
  const otherReviews = reviews.filter((r) => r.user.id !== currentUserId);
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
      setEditing(false); // Exit edit mode after a successful save
    }
    setSubmitting(false);
  }

  async function handleDelete() {
    await fetch(`/api/reviews?movieId=${movieId}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.user.id !== currentUserId));
    setRating(0);
    setContent("");
    setEditing(false);
  }

  function startEditing() {
    if (!myReview) return;
    setRating(myReview.rating);
    setContent(myReview.content ?? "");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    if (myReview) {
      // Restore form fields to the saved review
      setRating(myReview.rating);
      setContent(myReview.content ?? "");
    }
  }

  // Form is visible when: signed in AND (no review yet OR currently editing)
  const showForm = !!currentUserId && (!myReview || editing);

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

      {/* Slot: either form, user-review card, or login CTA */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium mb-3">
            {editing ? "Cập nhật đánh giá của bạn" : "Viết đánh giá"}
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
            placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
            rows={3}
            maxLength={2000}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/40 resize-none"
          />
          {content.length > 1800 && (
            <p className="text-xs text-white/40 mt-1 text-right">{content.length}/2000</p>
          )}

          <div className="flex justify-end items-center gap-2 mt-3">
            {editing && (
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={!rating || submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black text-sm font-semibold rounded-full transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {editing ? "Cập nhật" : "Gửi"}
            </button>
          </div>
        </form>
      ) : myReview ? (
        // Existing review with inline Edit / Delete actions
        <div className="bg-white/5 border border-yellow-400/20 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {myReview.user.image ? (
                <Image src={myReview.user.image} alt={myReview.user.name ?? ""} width={32} height={32} className="rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">👤</div>
              )}
              <div>
                <p className="text-sm font-medium">
                  {myReview.user.name}
                  <span className="ml-1.5 text-xs text-yellow-400">(đánh giá của bạn)</span>
                </p>
                <p className="text-xs text-white/40">{new Date(myReview.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-400/10 rounded-full px-2.5 py-0.5 shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">{myReview.rating}</span>
            </div>
          </div>
          {myReview.content && (
            <p className="text-sm text-white/70 leading-relaxed mb-3">{myReview.content}</p>
          )}
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-yellow-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/10"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          </div>
        </div>
      ) : (
        // Not signed in
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 text-center">
          <p className="text-sm text-white/60 mb-3">Đăng nhập để chia sẻ cảm nhận của bạn</p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <LogIn className="w-4 h-4" /> Đăng nhập để đánh giá
          </button>
        </div>
      )}

      {/* Other people's reviews */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
      ) : otherReviews.length === 0 && !myReview ? (
        <p className="text-center py-8 text-white/30 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : otherReviews.length > 0 ? (
        <div className="space-y-3">
          {otherReviews.map((review) => (
            <div key={review.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {review.user.image ? (
                    <Image src={review.user.image} alt={review.user.name ?? ""} width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">👤</div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{review.user.name}</p>
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
      ) : null}
    </section>
  );
}
