"use client";

import { ReportCard } from "./report-card";
import { ScoreBadge } from "./score-badge";

interface ReportData {
  overallScore: number;
  overallRoast: string;
  categories: Record<string, { score: number; roast: string; findings: Array<{ text: string; severity: "critical" | "warning" | "nice-to-have" }>; fixFirst: string; }>;
}

interface ReportViewProps { url: string; report: ReportData; screenshotUrl?: string; slug: string; appUrl: string; }

const categoryTitles: Record<string, string> = {
  firstImpressions: "First Impressions", seoHealth: "SEO Health", conversionCopy: "Conversion Copy",
  designUx: "Design & UX", technicalPerformance: "Technical Performance", trustCredibility: "Trust & Credibility",
};

function scoreToGrade(score: number): string {
  if (score >= 90) return "A"; if (score >= 80) return "B"; if (score >= 70) return "C"; if (score >= 60) return "D"; return "F";
}

export function ReportView({ url, report, screenshotUrl, slug, appUrl }: ReportViewProps) {
  const normalizedAppUrl = appUrl.replace(/\/$/, "");
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="mb-2 text-3xl font-bold text-[#f5f1e8]">Roast Report for <span className="text-[#e4b63b]">{url}</span></h1>
        <div className="flex justify-center my-6"><ScoreBadge score={report.overallScore} grade={scoreToGrade(report.overallScore)} /></div>
        <p className="text-xl italic text-[#d4cfc1]">&ldquo;{report.overallRoast}&rdquo;</p>
      </div>
      {screenshotUrl && (
        <div className="mb-12 overflow-hidden rounded-[28px] border border-[#2b2619] bg-[#141414] shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
          <img src={screenshotUrl} alt={`Screenshot of ${url}`} className="w-full" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {Object.entries(report.categories).map(([key, category]) => (
          <ReportCard key={key} title={categoryTitles[key] || key} score={category.score} grade={scoreToGrade(category.score)}
            roast={category.roast} findings={category.findings} fixFirst={category.fixFirst} />
        ))}
      </div>
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-4">
          <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/report/${slug}`)}
            className="rounded-2xl border border-[#40361f] bg-[#191919] px-6 py-3 text-[#d4cfc1] hover:border-[#5f4b19] hover:bg-[#1d1b16]">Copy Share Link</button>
          <a href={`/api/roast/${slug}/pdf`} className="rounded-2xl bg-[#e4b63b] px-6 py-3 font-semibold text-[#111111] hover:bg-[#f5c74d]">Download PDF</a>
        </div>
        <details className="mt-6 text-left max-w-lg mx-auto">
          <summary className="cursor-pointer text-[#9f9888] hover:text-[#f5f1e8]">Embed a badge on your site</summary>
          <pre className="mt-2 overflow-x-auto rounded-2xl border border-[#2b2619] bg-[#141414] p-4 text-xs text-[#d4cfc1]">
            {`<a href="${normalizedAppUrl}/report/${slug}"><img src="${normalizedAppUrl}/api/og/${slug}" alt="SiteRoast Score: ${report.overallScore}/100" width="200" /></a>`}
          </pre>
        </details>
      </div>
    </div>
  );
}
