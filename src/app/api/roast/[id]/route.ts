import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const report = await prisma.report.findFirst({
    where: { OR: [{ id }, { shareSlug: id }] },
  });

  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const categoryScores = report.categoryScores as Record<string, unknown>;

  if (report.isPreview) {
    const roast = categoryScores as unknown as {
      overallRoast: string;
      categories: Record<string, { findings: Array<{ text: string; severity: string }> }>;
    };
    return NextResponse.json({
      id: report.id, url: report.url, slug: report.shareSlug,
      overallScore: report.overallScore, overallGrade: report.overallGrade,
      isPreview: true, overallRoast: roast.overallRoast,
      topFindings: [
        roast.categories?.firstImpressions?.findings?.[0],
        roast.categories?.seoHealth?.findings?.[1],
        roast.categories?.technicalPerformance?.findings?.[2],
      ].filter(Boolean),
    });
  }

  return NextResponse.json({
    id: report.id, url: report.url, slug: report.shareSlug,
    overallScore: report.overallScore, overallGrade: report.overallGrade,
    isPreview: false, report: categoryScores,
    lighthouseScores: report.lighthouseData, screenshotUrl: report.screenshotUrl,
  });
}
