import { ImageResponse } from "next/og";

/**
 * Required with `output: "export"` in next.config.ts — Next.js won't generate
 * a dynamic route at build time unless it's explicitly declared static.
 */
export const dynamic = "force-static";

export const alt = "Izzy Thomson — AI product engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2742c9",
          padding: "80px 80px 72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#fbf6e9",
        }}
      >
        {/* Top strip: site-mark + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "10px",
              background: "#fbf6e9",
              color: "#2742c9",
              fontSize: "40px",
              fontStyle: "italic",
              fontWeight: 700,
              letterSpacing: "-1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              paddingBottom: "6px",
            }}
          >
            Iz
          </div>
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.75,
              fontWeight: 600,
            }}
          >
            izzyt.com
          </div>
        </div>

        {/* Main stack: name + role */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "112px",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Izzy Thomson
          </div>
          <div
            style={{
              fontSize: "38px",
              lineHeight: 1.2,
              opacity: 0.92,
              maxWidth: "1000px",
              fontWeight: 400,
            }}
          >
            AI product engineer · ships AI tools, agents, and enterprise AI systems
          </div>
        </div>

        {/* Bottom: motto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "26px",
            fontStyle: "italic",
            opacity: 0.7,
            fontWeight: 500,
          }}
        >
          &ldquo;Demo, don&apos;t memo.&rdquo;
        </div>
      </div>
    ),
    { ...size },
  );
}
