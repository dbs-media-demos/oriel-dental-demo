import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { MARK } from "@/components/brand/Logo";

// Brand fonts, read once. URLs relative to this file are traced into the deployment.
const [serif, serifItalic, sans500, sans600] = await Promise.all([
  readFile(new URL("../../../assets/fonts/Fraunces-300.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/Fraunces-300-Italic.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/Figtree-500.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/Figtree-600.ttf", import.meta.url)),
]);

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=… */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Dentistry, in a better light.").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Uptown Dallas").slice(0, 60);
  const size = title.length > 70 ? 60 : title.length > 40 ? 74 : 92;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#f7f4ee", fontFamily: "Figtree" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 56px 60px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="44" height="53" viewBox={MARK.viewBox} fill="none">
              <path d={MARK.arch} stroke="#1e2926" strokeWidth="2.2" strokeLinecap="round" />
              <path d={MARK.sill} stroke="#1e2926" strokeWidth="2.2" strokeLinecap="round" />
              <path d={MARK.smile} stroke="#1e2926" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx={MARK.sun.cx} cy={MARK.sun.cy} r={MARK.sun.r} fill="#e2a93b" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "Fraunces", fontSize: 40, color: "#1e2926", lineHeight: 1 }}>Oriel</div>
              <div style={{ fontSize: 13, letterSpacing: 5, color: "#55615c", marginTop: 4, fontWeight: 600 }}>DENTAL STUDIO</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", color: "#4e6b5c", fontSize: 20, letterSpacing: 4, fontWeight: 600, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: size, lineHeight: 1.02, letterSpacing: -2, color: "#1e2926", maxWidth: 640 }}>{title}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#55615c", fontSize: 20 }}>
            <div style={{ display: "flex", fontFamily: "FrauncesItalic", fontSize: 28, color: "#4e6b5c" }}>Dentistry, in a better light.</div>
          </div>
        </div>
        <div style={{ width: 420, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingRight: 56 }}>
          <div
            style={{
              width: 360,
              height: 540,
              display: "flex",
              borderTopLeftRadius: 180,
              borderTopRightRadius: 180,
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              backgroundImage: "linear-gradient(180deg, #f2d9a6 0%, #dfe8e1 45%, #b9cbbe 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 90, left: 150, width: 60, height: 60, borderRadius: 60, backgroundColor: "#fbf9f5" }} />
            <div
              style={{
                position: "absolute",
                bottom: 120,
                left: 90,
                width: 180,
                height: 90,
                borderBottomLeftRadius: 90,
                borderBottomRightRadius: 90,
                borderBottom: "6px solid #4e6b5c",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Fraunces", data: serif, weight: 300, style: "normal" },
        { name: "FrauncesItalic", data: serifItalic, weight: 300, style: "italic" },
        { name: "Figtree", data: sans500, weight: 500, style: "normal" },
        { name: "Figtree", data: sans600, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
