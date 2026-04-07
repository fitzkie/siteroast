"use client";

import { ReportCard } from "./report-card";
import { ScoreBadge } from "./score-badge";

interface ReportData {
  overallScore: number;
  overallRoast: string;
  categories: Record<string, { score: number; roast: string; findings: Array<{ text: string; severity: "critical" | "warning" | "nice-to-have" }>; fixFirst: string; }>;
}

interface ReportViewProps { url: string; report: ReportData; screenshotUrl?: string; slug: string; }

const categoryTitles: Record<string, string> = {
  firstImpressions: "First Impressions", seoHealth: "SEO Health", conversionCopy: "Conversion Copy",
  designUx: "Design & UX", technicalPerformance: "Technical Performance", trustCredibility: "Trust & Credibility",
};

function scoreToGrade(score: number): string {
  if (score >= 90) return "A"; if (score >= 80) return "B"; if (score >= 70) return "C"; if (score >= 60) return "D"; return "F";
}

export function ReportView({ url, report, screenshotUrl, slug }: ReportViewProps) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Roast Report for <span className="text-orange-500">{url}</span></h1>
        <div className="flex justify-center my-6"><ScoreBadge score={report.overallScore} grade={scoreToGrade(report.overallScore)} /></div>
        <p className="text-xl text-gray-300 italic">&ldquo;{report.overallRoast}&rdquo;</p>
      </div>
      {screenshotUrl && (
        <div className="mb-12 rounded-xl border border-gray-800 overflow-hidden">
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
            className="rounded-xl border border-gray-700 px-6 py-3 text-gray-300 hover:bg-gray-800 transition">Copy Share Link</button>
          <a href={`/api/roast/${slug}/pdf`} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition">Download PDF</a>
        </div>
        <details className="mt-6 text-left max-w-lg mx-auto">
          <summary className="cursor-pointer text-gray-400 hover:text-gray-300">Embed a badge on your site</summary>
          <pre className="mt-2 rounded-lg bg-gray-800 p-4 text-xs text-gray-300 overflow-x-auto">
            {`<a href="${typeof window !== 'undefined' ? window.location.origin : ''}/report/${slug}"><img src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/og/${slug}" alt="SiteRoast Score: ${report.overallScore}/100" width="200" /></a>`}
          </pre>
        </details>
      </div>
    </div>
  );
}
