import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ReportView } from "@/components/report-view";
import { ReportPreview } from "@/components/report-preview";
import type { Metadata } from "next";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = await prisma.report.findUnique({ where: { shareSlug: slug } });
  if (!report) return { title: "Report Not Found" };
  const roast = report.categoryScores as { overallRoast?: string };
  const domain = new URL(report.url).hostname;
  return {
    title: `${domain} scored ${report.overallScore}/100 on SiteRoast`,
    description: roast.overallRoast || "Get your site roasted by AI.",
    openGraph: {
      title: `${domain} scored ${report.overallScore}/100 on SiteRoast`,
      description: roast.overallRoast || "Get your site roasted by AI.",
      images: [{ url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og/${slug}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { slug } = await params;
  const report = await prisma.report.findUnique({ where: { shareSlug: slug } });
  if (!report) notFound();

  const categoryScores = report.categoryScores as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f1e8]">
      <Nav />
      {report.isPreview ? (
        <ReportPreview id={report.id} url={report.url} overallScore={report.overallScore} overallGrade={report.overallGrade}
          overallRoast={(categoryScores as any).overallRoast}
          topFindings={[(categoryScores as any).categories?.firstImpressions?.findings?.[0], (categoryScores as any).categories?.seoHealth?.findings?.[1], (categoryScores as any).categories?.technicalPerformance?.findings?.[2]].filter(Boolean)} />
      ) : (
        <ReportView
          url={report.url}
          report={categoryScores as any}
          screenshotUrl={report.screenshotUrl || undefined}
          slug={report.shareSlug}
          appUrl={process.env.NEXT_PUBLIC_APP_URL || ""}
        />
      )}
      <div className="border-t border-[#4c3b13] bg-[rgba(228,182,59,0.08)] py-6 text-center">
        <p className="text-lg text-[#f3deb1]">Want to know how your site stacks up? <a href="/" className="font-semibold underline hover:text-[#fff4d4]">Get your own roast</a></p>
      </div>
      <Footer />
    </div>
  );
}
