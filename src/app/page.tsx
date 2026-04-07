"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { UrlInput } from "@/components/url-input";
import { ScoreBadge } from "@/components/score-badge";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<{
    id: string; slug: string; overallScore: number; overallGrade: string;
    overallRoast: string; topFindings: Array<{ text: string; severity: string }>;
  } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(url: string) {
    setIsLoading(true); setError(""); setPreview(null);
    try {
      const response = await fetch("/api/roast", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Something went wrong"); return; }
      if (data.isPreview) { setPreview(data); } else { router.push(`/report/${data.slug}`); }
    } catch { setError("Failed to connect. Please try again."); } finally { setIsLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold leading-tight md:text-6xl">
          Your website is <span className="text-orange-500">losing you money.</span><br />Find out why in 60 seconds.
        </h1>
        <p className="mt-6 text-xl text-gray-400">Get an AI-powered audit of your website&apos;s SEO, design, performance, and conversion copy &mdash; delivered as a brutally honest (but helpful) roast.</p>
        <div className="mt-10 flex justify-center"><UrlInput onSubmit={handleSubmit} isLoading={isLoading} /></div>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </section>

      {/* Preview Result */}
      {preview && (
        <section className="mx-auto max-w-2xl px-6 pb-16">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
            <div className="flex justify-center mb-4"><ScoreBadge score={preview.overallScore} grade={preview.overallGrade} /></div>
            <p className="text-xl text-gray-300 italic mb-6">&ldquo;{preview.overallRoast}&rdquo;</p>
            <h3 className="text-lg font-semibold text-white mb-4">Top Findings</h3>
            <div className="space-y-2 text-left mb-8">
              {preview.topFindings.map((finding, i) => (
                <div key={i} className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-300">{finding.text}</div>
              ))}
            </div>
            <div className="relative">
              <div className="blur-sm opacity-30 space-y-2"><div className="h-16 rounded-lg bg-gray-800" /><div className="h-16 rounded-lg bg-gray-800" /><div className="h-16 rounded-lg bg-gray-800" /></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-semibold mb-4">Unlock the full report with 6 detailed categories + PDF</p>
                <div className="flex gap-4">
                  <button onClick={() => router.push(`/login?reportId=${preview.id}`)} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition">Unlock Report &mdash; $29</button>
                  <button onClick={() => router.push("/pricing")} className="rounded-xl border border-orange-500 px-6 py-3 font-semibold text-orange-500 hover:bg-orange-500/10 transition">Go Unlimited &mdash; $99/mo</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ step: "1", title: "Paste Your URL", desc: "Enter any website URL and hit Roast My Site." },
            { step: "2", title: "Get Roasted", desc: "Our AI analyzes your site across 6 categories and delivers a witty, actionable audit." },
            { step: "3", title: "Fix & Grow", desc: "Follow the prioritized recommendations to improve your site and win more customers." }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold">{item.step}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
            <h3 className="text-xl font-semibold">Single Report</h3>
            <div className="mt-4 flex items-baseline"><span className="text-4xl font-bold">$29</span><span className="ml-2 text-gray-400">one-time</span></div>
            <ul className="mt-6 space-y-3 text-gray-300"><li>Full 6-category audit</li><li>Downloadable PDF report</li><li>Shareable report link</li></ul>
          </div>
          <div className="rounded-2xl border border-orange-500 bg-gray-900 p-8 ring-2 ring-orange-500/20">
            <span className="mb-4 inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-medium">Best Value</span>
            <h3 className="text-xl font-semibold">Unlimited</h3>
            <div className="mt-4 flex items-baseline"><span className="text-4xl font-bold">$99</span><span className="ml-2 text-gray-400">/month</span></div>
            <ul className="mt-6 space-y-3 text-gray-300"><li>Unlimited roasts</li><li>Re-run audits to track progress</li><li>Report history dashboard</li><li>PDF downloads on all reports</li></ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div className="space-y-6">
          {[{ q: "What exactly do you analyze?", a: "We audit 6 areas: First Impressions, SEO Health, Conversion Copy, Design & UX, Technical Performance, and Trust & Credibility. Each gets a score, a roast, and specific action items." },
            { q: "How long does it take?", a: "About 30-60 seconds. We run a real Lighthouse audit and AI analysis in parallel to keep it fast." },
            { q: "Can I share my report?", a: "Yes! Every paid report gets a unique shareable link. Great for showing your team or flexing a high score." },
            { q: "Is the roast actually useful?", a: "Absolutely. Every joke comes with a real, actionable finding. Think of it as a code review with personality." },
            { q: "Can I roast a competitor's site?", a: "We won't tell if you don't." }
          ].map((item, i) => (
            <div key={i} className="border-b border-gray-800 pb-6">
              <h3 className="text-lg font-semibold">{item.q}</h3>
              <p className="mt-2 text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
