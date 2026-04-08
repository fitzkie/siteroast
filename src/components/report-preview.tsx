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
      <div className="rounded-[32px] border border-[#2b2619] bg-[#141414] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <h2 className="mb-2 text-2xl font-bold text-[#f5f1e8]">Preview for <span className="text-[#e4b63b]">{url}</span></h2>
        <div className="flex justify-center my-6"><ScoreBadge score={overallScore} grade={overallGrade} /></div>
        <p className="mb-6 text-xl italic text-[#d4cfc1]">&ldquo;{overallRoast}&rdquo;</p>
        <div className="space-y-2 text-left mb-8">
          {topFindings.map((finding, i) => (<div key={i} className="rounded-2xl border border-[#322d21] bg-[#1a1a1a] px-4 py-3 text-[#d4cfc1]">{finding.text}</div>))}
        </div>
        <div className="relative mb-8">
          <div className="space-y-2 opacity-30 blur-sm"><div className="h-24 rounded-2xl bg-[#1d1d1d]" /><div className="h-24 rounded-2xl bg-[#1d1d1d]" /></div>
          <div className="absolute inset-0 flex items-center justify-center"><p className="text-lg font-semibold text-[#f5f1e8]">6 detailed categories + PDF awaiting...</p></div>
        </div>
        <button onClick={handleUnlock} className="rounded-2xl bg-[#e4b63b] px-8 py-4 text-lg font-semibold text-[#111111] shadow-[0_14px_30px_rgba(228,182,59,0.18)] hover:bg-[#f5c74d]">Unlock Full Report &mdash; $29</button>
      </div>
    </div>
  );
}
