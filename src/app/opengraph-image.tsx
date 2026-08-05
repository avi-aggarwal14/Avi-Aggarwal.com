import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/**
 * Social preview card, rendered at build time.
 *
 * Generating this rather than shipping a static PNG means the card can never
 * drift out of sync with the site — change the name or tagline in
 * `content/site.ts` and the link preview updates with it.
 *
 * Satori (which powers ImageResponse) supports only a subset of CSS: flexbox,
 * absolute positioning, plain gradients. No CSS variables, no mask-image, no
 * filters. So the palette is repeated literally here — the one place in the
 * project where token values are duplicated, and unavoidable.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.meta.title}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Champagne bloom, top right. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 640,
            height: 640,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(214,183,124,0.22) 0%, rgba(214,183,124,0) 70%)",
            display: "flex",
          }}
        />
        {/* Warm floor light. */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 260,
            background:
              "linear-gradient(to top, rgba(214,183,124,0.10), rgba(214,183,124,0))",
            display: "flex",
          }}
        />

        {/* Top rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(to right, #d6b77c, rgba(214,183,124,0))",
            display: "flex",
          }}
        />

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{ width: 44, height: 2, background: "#d6b77c", display: "flex" }}
          />
          <div
            style={{
              color: "#9c978d",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {site.hero.eyebrow}
          </div>
        </div>

        {/* Name + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f3efe7",
              fontSize: 128,
              lineHeight: 1,
              letterSpacing: -3,
              display: "flex",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              color: "#9c978d",
              fontSize: 34,
              marginTop: 28,
              maxWidth: 900,
              display: "flex",
            }}
          >
            {site.tagline}
          </div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(243,239,231,0.14)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#d6b77c",
                display: "flex",
              }}
            />
            <div style={{ color: "#f3efe7", fontSize: 24 }}>{site.domain}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
