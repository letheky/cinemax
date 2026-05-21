import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center px-4">
      <p className="text-8xl">🎬</p>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-white/60 text-lg">Trang không tồn tại</p>
      <Link
        href="/"
        className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2.5 rounded-full transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
