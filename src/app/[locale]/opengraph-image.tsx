import { ImageResponse } from "next/og";

export const alt = "Ali Mortazavi: Senior Front-End Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin only: the built-in OG font has no Persian glyphs, and the name reads the same in every locale
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#f3f0e9",
        background:
          "radial-gradient(60% 70% at 25% 40%, rgba(123,92,255,0.55), transparent 70%), radial-gradient(50% 60% at 80% 70%, rgba(255,107,61,0.35), transparent 70%), #070709",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26 }}>
        <div style={{ width: 14, height: 14, borderRadius: 14, background: "#d4ff3f" }} />
        alimor.ir
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -6, lineHeight: 0.9 }}>
          Ali
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: -6,
            lineHeight: 0.9,
          }}
        >
          Mortazavi<span style={{ color: "#d4ff3f" }}>.</span>
        </div>
        <div style={{ fontSize: 36, marginTop: 28, color: "#9a968d" }}>
          Senior Front-End Engineer · Founder of Paradise Code
        </div>
      </div>
    </div>,
    size,
  );
}
