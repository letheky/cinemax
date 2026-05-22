import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "7px",
          position: "relative",
        }}
      >
        {/* Top sprocket holes */}
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "space-around",
            paddingLeft: "4px",
            paddingRight: "4px",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "1px",
                background: "#facc15",
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Bold "C" lettermark */}
        <div
          style={{
            fontSize: "19px",
            fontWeight: "900",
            color: "#facc15",
            lineHeight: 1,
            marginTop: "1px",
            fontFamily: "Arial Black, sans-serif",
          }}
        >
          C
        </div>

        {/* Bottom sprocket holes */}
        <div
          style={{
            position: "absolute",
            bottom: "3px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "space-around",
            paddingLeft: "4px",
            paddingRight: "4px",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "1px",
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
