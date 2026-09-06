import { ImageResponse } from "next/og";
import { meta } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${meta.name} · ${meta.role}`;

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
          background: "#0f1012",
          color: "#ede9e1",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 26, color: "#82838d", letterSpacing: "0.06em" }}>
          {meta.github}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 148, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.88 }}>
            ahmed
          </div>
          <div style={{ fontSize: 148, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.88, paddingLeft: 12 }}>
            elshiekh
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, borderTop: "1px solid #2a2b31", paddingTop: 28 }}>
          <div style={{ width: 40, height: 3, background: "#72ada2" }} />
          <div style={{ display: "flex", fontSize: 30, color: "#ede9e1", letterSpacing: "0.01em" }}>
            {`${meta.role} · ${meta.location}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
