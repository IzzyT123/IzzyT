import { ImageResponse } from "next/og";

/**
 * Required with `output: "export"` in next.config.ts — Next.js won't generate
 * a dynamic route at build time unless it's explicitly declared static.
 */
export const dynamic = "force-static";

export const alt = "Izzy Thomson — Demo, don't memo.";
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
          background: "#1f3b73",
          padding: "76px 80px 68px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top strip: site-mark + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "6px",
                background: "#ffffff",
                color: "#1f3b73",
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-1px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              IT
            </div>
            <div
              style={{
                fontSize: "20px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#c5d7fa",
                fontWeight: 700,
              }}
            >
              Izzy Thomson · @IzzyT_com
            </div>
          </div>
          <div
            style={{
              fontSize: "18px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.32)",
              padding: "8px 18px",
              fontWeight: 600,
            }}
          >
            Head of AI at Issoria
          </div>
        </div>

        {/* Main stack: DEMO, DON'T MEMO. + bio */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          <div
            style={{
              fontSize: "104px",
              fontWeight: 800,
              lineHeight: 0.96,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            DEMO, DON&apos;T MEMO.
          </div>
          <div
            style={{
              fontSize: "32px",
              lineHeight: 1.32,
              color: "#dbe7ff",
              maxWidth: "1020px",
              fontWeight: 500,
            }}
          >
            Building AI agents for big companies as Head of AI at Issoria. Shipping my own AI apps on the side and posting what I learn.
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.22)",
            paddingTop: "22px",
            fontSize: "20px",
            color: "#c5d7fa",
            fontWeight: 600,
          }}
        >
          <span>izzyt.com</span>
          <span>&ldquo;Demo, don&apos;t memo.&rdquo;</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
