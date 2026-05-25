import { ImageResponse } from "next/og";

export const alt = "Bayan — Ethnic Wear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #6f8161 0%, #4d5b41 100%)",
          color: "#faf6ec",
        }}
      >
        <svg width="90" height="126" viewBox="0 0 100 140" fill="none">
          <path
            d="M14 132 L14 50 Q14 12 50 12 Q86 12 86 50 L86 132"
            stroke="#c1a572"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M50 38 Q50 70 50 110" stroke="#c1a572" strokeWidth="2" />
          <circle cx="50" cy="36" r="4" fill="#c1a572" />
        </svg>
        <div
          style={{
            fontSize: 88,
            letterSpacing: 14,
            marginTop: 28,
            fontWeight: 600,
          }}
        >
          BAYAN
        </div>
        <div style={{ fontSize: 22, letterSpacing: 10, color: "#c1a572" }}>
          ETHNIC WEAR
        </div>
        <div style={{ fontSize: 26, marginTop: 24, color: "#faf6ecc0" }}>
          Woven in tradition, designed for today.
        </div>
      </div>
    ),
    { ...size },
  );
}
