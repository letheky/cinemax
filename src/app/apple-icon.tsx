import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0f",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
          position: "relative",
        }}
      >
        {/* Top sprocket holes */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "space-around",
            paddingLeft: "22px",
            paddingRight: "22px",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                background: "#facc15",
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Bold "C" lettermark */}
        <div
          style={{
            fontSize: "108px",
            fontWeight: "900",
            color: "#facc15",
            lineHeight: 1,
            fontFamily: "Arial Black, sans-serif",
          }}
        >
          C
        </div>

        {/* Bottom sprocket holes */}
        <div
          style={{
            position: "absolute",
            bottom: "18px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "space-around",
            paddingLeft: "22px",
            paddingRight: "22px",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                background: "#facc15",
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
