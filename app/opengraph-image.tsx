import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name}, ${siteConfig.brand}`;
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
          justifyContent: "space-between",
          background: "#f2eee5",
          color: "#151412",
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6a655d",
            borderBottom: "3px solid #151412",
            paddingBottom: 20,
          }}
        >
          <span>Boston, Massachusetts</span>
          <span>Vol. I · The Systems Journal</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, color: "#6a655d", marginBottom: 8 }}>
            The Systems Journal
          </div>
          <div style={{ fontSize: 128, fontWeight: 600, lineHeight: 1 }}>
            Hari Kancharla
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#a82e1d",
              marginTop: 18,
              maxWidth: 900,
            }}
          >
            Building AI systems that have to prove they work.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#6a655d",
            borderTop: "1px solid #b8b0a3",
            paddingTop: 20,
          }}
        >
          <span>AI Systems Engineer</span>
          <span>Evaluation · Agents · Retrieval · Infrastructure</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
