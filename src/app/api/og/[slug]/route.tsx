import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reportRes = await fetch(`${appUrl}/api/roast/${slug}`);

  if (!reportRes.ok) {
    return new ImageResponse(
      (<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#111827", color: "#fff", fontSize: 48 }}>SiteRoast</div>),
      { width: 1200, height: 630 }
    );
  }

  const data = await reportRes.json();
  const domain = new URL(data.url).hostname;
  const score = data.overallScore;
  const grade = data.overallGrade;
  const roast = data.isPreview ? data.overallRoast : data.report?.overallRoast || "";
  const scoreColor = score >= 90 ? "#4ade80" : score >= 70 ? "#facc15" : score >= 50 ? "#fb923c" : "#f87171";

  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#111827", padding: "60px" }}>
      <div style={{ fontSize: 32, color: "#f97316", fontWeight: "bold", marginBottom: 20 }}>SiteRoast</div>
      <div style={{ fontSize: 28, color: "#9ca3af", marginBottom: 30 }}>{domain}</div>
      <div style={{ fontSize: 120, fontWeight: "bold", color: scoreColor, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: 36, color: "#6b7280", marginTop: 8, marginBottom: 30 }}>/100 - Grade {grade}</div>
      {roast && <div style={{ fontSize: 22, color: "#d1d5db", fontStyle: "italic", textAlign: "center", maxWidth: 800 }}>{roast.slice(0, 120)}</div>}
    </div>),
    { width: 1200, height: 630 }
  );
}
