"use client";

import { useRouter } from "next/navigation";
import { ScoreBadge } from "./score-badge";

interface ReportPreviewProps { id: string; url: string; overallScore: number; overallGrade: string; overallRoast: string; topFindings: Array<{ text: string; severity: string }>; }

export function ReportPreview({ id, url, overallScore, overallGrade, overallRoast, topFindings }: ReportPreviewProps) {
  const router = useRouter();
  async function handleUnlock() {
    const response = await fetch(`/api/roast/${id}/unlock`, { method: "POST" });
    const data = await response.json();
    if (data.unlocked) { router.push(`/report/${data.slug}`); }
    else if (data.checkoutUrl) { window.location.href = data.checkoutUrl; }
    else if (response.status === 401) { router.push(`/login?reportId=${id}`); }
  }
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Preview for <span className="text-orange-500">{url}</span></h2>
        <div className="flex justify-center my-6"><ScoreBadge score={overallScore} grade={overallGrade} /></div>
        <p className="text-xl text-gray-300 italic mb-6">&ldquo;{overallRoast}&rdquo;</p>
        <div className="space-y-2 text-left mb-8">
          {topFindings.map((finding, i) => (<div key={i} className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-300">{finding.text}</div>))}
        </div>
        <div className="relative mb-8">
          <div className="blur-sm opacity-30 space-y-2"><div className="h-24 rounded-lg bg-gray-800" /><div className="h-24 rounded-lg bg-gray-800" /></div>
          <div className="absolute inset-0 flex items-center justify-center"><p className="text-lg font-semibold">6 detailed categories + PDF awaiting...</p></div>
        </div>
        <button onClick={handleUnlock} className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-600 transition">Unlock Full Report &mdash; $29</button>
      </div>
    </div>
  );
}
