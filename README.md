# CineMax – Ứng dụng xem phim

Ứng dụng xem phim fullstack xây dựng bằng **Next.js 15**, **Tailwind CSS** và **TMDB API**.

## Tính năng

- **Trang chủ** – Hero banner, phim thịnh hành, đang chiếu, đánh giá cao, sắp ra mắt
- **Chi tiết phim** – Poster, backdrop, thông tin, diễn viên, trailer YouTube, phim tương tự
- **Tìm kiếm** – Tìm kiếm real-time với phân trang
- **Watchlist** – Lưu phim yêu thích (localStorage)
- **API Routes** – Backend routes bảo vệ TMDB API key
- **Responsive** – Mobile và desktop

## Công nghệ

| Layer    | Tech                             |
|----------|----------------------------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling  | Tailwind CSS v4                  |
| Icons    | Lucide React                     |
| Data     | TMDB API                         |
| Deploy   | Vercel                           |

## Cài đặt

### 1. Clone repo

```bash
git clone https://github.com/your-username/cinemax.git
cd cinemax
```

### 2. Lấy TMDB API Key

1. Đăng ký tại [themoviedb.org](https://www.themoviedb.org/signup)
2. Vào **Settings → API → Create** để lấy API key

### 3. Cấu hình environment

```bash
cp .env.example .env.local
```

Mở `.env.local` và điền:

```env
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### 4. Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Thêm Environment Variable `TMDB_API_KEY` trong Vercel dashboard
4. Click **Deploy**

## Cấu trúc

```
src/
├── app/
│   ├── page.tsx            # Trang chủ
│   ├── movie/[id]/         # Chi tiết phim
│   ├── search/             # Tìm kiếm
│   ├── watchlist/          # Danh sách đã lưu
│   └── api/movies/         # API routes
├── components/
│   ├── Navbar.tsx
│   ├── HeroBanner.tsx
│   ├── MovieCard.tsx
│   └── WatchlistButton.tsx
└── lib/
    ├── tmdb.ts             # TMDB API client
    └── watchlist.ts        # Watchlist (localStorage)
```

---

Dữ liệu phim từ [The Movie Database (TMDB)](https://www.themoviedb.org)
