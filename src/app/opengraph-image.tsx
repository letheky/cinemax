import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background movie-poster grid (decorative) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            padding: "20px",
            opacity: 0.035,
          }}
        >
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "62px",
                height: "93px",
                background: "#facc15",
                borderRadius: "6px",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Yellow glow */}
        <div
          style={{
            position: "absolute",
            width: "700px",
            height: "350px",
            background: "radial-gradient(ellipse, rgba(250,204,21,0.12) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Film-strip sprockets — top */}
        <div style={{ display: "flex", gap: "22px", marginBottom: "52px" }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                width: "14px",
                height: "20px",
                background: "#facc15",
                borderRadius: "3px",
                opacity: 0.55,
              }}
            />
          ))}
        </div>

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Icon badge */}
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#facc15",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "46px",
              fontWeight: "900",
              color: "#0a0a0f",
              fontFamily: "Arial Black, sans-serif",
            }}
          >
            C
          </div>

          {/* Wordmark */}
          <div
            style={{
              display: "flex",
              fontSize: "96px",
              fontWeight: "900",
              fontFamily: "Arial Black, sans-serif",
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#ffffff" }}>Cine</span>
            <span style={{ color: "#facc15" }}>Max</span>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "30px",
            marginTop: "20px",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          Khám phá hàng nghìn bộ phim nổi tiếng
        </p>

        {/* Film-strip sprockets — bottom */}
        <div style={{ display: "flex", gap: "22px", marginTop: "52px" }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                width: "14px",
                height: "20px",
                background: "#facc15",
                borderRadius: "3px",
                opacity: 0.55,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
