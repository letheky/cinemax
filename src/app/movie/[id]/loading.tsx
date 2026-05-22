// Shown instantly while the movie detail page fetches data (Next.js streaming)
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Backdrop skeleton */}
      <div className="h-[50vh] bg-white/5 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-40 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Poster skeleton */}
          <div className="w-40 sm:w-52 shrink-0 aspect-[2/3] bg-white/10 animate-pulse rounded-xl" />

          {/* Info skeleton */}
          <div className="flex-1 pt-4 sm:pt-20 space-y-4">
            <div className="h-3.5 w-28 bg-white/10 animate-pulse rounded" />
            <div className="h-9 w-3/4 bg-white/10 animate-pulse rounded" />
            <div className="h-4 w-56 bg-white/10 animate-pulse rounded" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 w-20 bg-white/5 animate-pulse rounded-full" />
              ))}
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="h-3.5 bg-white/5 animate-pulse rounded w-full" />
              <div className="h-3.5 bg-white/5 animate-pulse rounded w-11/12" />
              <div className="h-3.5 bg-white/5 animate-pulse rounded w-4/5" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-32 bg-white/10 animate-pulse rounded-full" />
              <div className="h-10 w-28 bg-white/5 animate-pulse rounded-full" />
            </div>
          </div>
        </div>

        {/* Cast skeleton */}
        <div className="mb-12">
          <div className="h-6 w-32 bg-white/10 animate-pulse rounded mb-4" />
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-24 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-white/5 animate-pulse" />
                <div className="h-3 w-16 bg-white/5 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews skeleton */}
        <div className="mb-12">
          <div className="h-6 w-48 bg-white/10 animate-pulse rounded mb-4" />
          <div className="bg-white/5 rounded-xl p-4 mb-4 h-32 animate-pulse" />
          {[0, 1].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 mb-3 h-20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
