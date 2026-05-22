// Shown instantly while the home page fetches data (Next.js streaming)
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="w-full h-[70vh] min-h-[500px] bg-white/5 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {[0, 1].map((s) => (
          <div key={s}>
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-44 bg-white/10 animate-pulse rounded-lg" />
              <div className="h-4 w-24 bg-white/5 animate-pulse rounded-lg" />
            </div>
            {/* Movie grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="aspect-[2/3] bg-white/5 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3.5 bg-white/5 animate-pulse rounded w-full" />
                    <div className="h-3 bg-white/[0.03] animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
