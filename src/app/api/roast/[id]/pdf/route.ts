import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPdf } from "@/lib/pdf-generator";
import React from "react";

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const report = await prisma.report.findFirst({
    where: { OR: [{ id }, { shareSlug: id }] },
  });

  if (!report || report.isPreview) {
    return NextResponse.json({ error: "Report not found or not unlocked" }, { status: 404 });
  }

  const categoryScores = report.categoryScores as { overallRoast: string; categories: Record<string, unknown> };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const shareUrl = `${appUrl}/report/${report.shareSlug}`;

  const pdfBuffer = await renderToBuffer(
    React.createElement(ReportPdf, {
      url: report.url,
      overallScore: report.overallScore,
      overallGrade: report.overallGrade,
      report: categoryScores as any,
      shareUrl,
    })
  );

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="siteroast-${report.shareSlug}.pdf"`,
    },
  });
}
