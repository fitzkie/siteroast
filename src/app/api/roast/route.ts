import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { validateUrl } from "@/lib/utils";
import { generateReport } from "@/lib/report-pipeline";

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  if (!url || !validateUrl(url)) {
    return NextResponse.json({ error: "Please provide a valid URL" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as { id: string }).id : null;

  let isSubscriber = false;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    isSubscriber = user?.subscriptionStatus === "active";
  }

  try {
    const result = await generateReport(url);
    const screenshotBase64 = result.screenshot.toString("base64");

    const report = await prisma.report.create({
      data: {
        userId,
        url,
        overallScore: result.overallScore,
        overallGrade: result.overallGrade,
        categoryScores: result.roast as unknown as Prisma.InputJsonValue,
        lighthouseData: result.lighthouseScores as unknown as Prisma.InputJsonValue,
        screenshotUrl: `data:image/png;base64,${screenshotBase64}`,
        shareSlug: result.shareSlug,
        isPreview: !isSubscriber,
      },
    });

    return NextResponse.json({
      id: report.id, slug: report.shareSlug,
      overallScore: report.overallScore, overallGrade: report.overallGrade,
      isPreview: report.isPreview,
      ...(report.isPreview
        ? {
            overallRoast: result.roast.overallRoast,
            topFindings: [
              result.roast.categories.firstImpressions.findings[0],
              result.roast.categories.seoHealth.findings[1],
              result.roast.categories.technicalPerformance.findings[2],
            ],
          }
        : {
            report: result.roast,
            lighthouseScores: result.lighthouseScores,
            screenshotUrl: report.screenshotUrl,
          }),
    });
  } catch (error) {
    console.error("Report generation failed:", error);
    return NextResponse.json({ error: "Failed to analyze website. Please try again." }, { status: 500 });
  }
}
