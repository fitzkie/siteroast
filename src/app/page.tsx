"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { UrlInput } from "@/components/url-input";
import { ScoreBadge } from "@/components/score-badge";

interface PreviewData {
  id: string;
  slug: string;
  overallScore: number;
  overallGrade: string;
  overallRoast: string;
  topFindings: Array<{ text: string; severity: string }>;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(url: string) {
    setIsLoading(true);
    setError("");
    setPreview(null);
    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      if (data.isPreview) {
        setPreview(data);
      } else {
        router.push(`/report/${data.slug}`);
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearPreview() {
    setPreview(null);
  }

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f1e8]">
      <Nav />
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
        <span className="inline-flex rounded-full border border-[#4c3b13] bg-[#17140e] px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#f5c74d]">
          AI Revenue Audit
        </span>
        <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
          Your website is <span className="text-[#e4b63b]">losing you money.</span>
          <br />
          Find out why in 60 seconds.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl text-[#9f9888]">
          Get an AI-powered audit of your website&apos;s SEO, design, performance, and conversion copy, delivered as a brutally honest teardown with clear next steps.
        </p>
        <div className="mt-10 flex justify-center">
          <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </section>

      {/* Preview Result */}
      {preview && (
        <section id="results" className="mx-auto max-w-2xl px-6 pb-16">
          <div className="rounded-[32px] border border-[#2b2619] bg-[#141414] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
            <div className="flex justify-center mb-4">
              <ScoreBadge score={preview.overallScore} grade={preview.overallGrade} />
            </div>

            <p className="mb-6 text-center text-xl italic text-[#d4cfc1]">
              &ldquo;{preview.overallRoast}&rdquo;
            </p>

            <h3 className="mb-4 text-center text-lg font-semibold text-[#f5f1e8]">Top Findings</h3>
            <div className="space-y-2 text-left mb-8">
              {preview.topFindings.map((finding, i) => (
                <div key={i} className="rounded-2xl border border-[#322d21] bg-[#1a1a1a] px-4 py-3 text-[#d4cfc1]">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    finding.severity === "critical" ? "bg-red-500" : finding.severity === "warning" ? "bg-yellow-500" : "bg-blue-500"
                  }`} />
                  {finding.text}
                </div>
              ))}
            </div>

            {/* Blurred content + CTA */}
            <div className="relative mb-6">
              <div className="blur-sm opacity-30 space-y-2">
                <div className="h-20 rounded-2xl bg-[#1d1d1d]" />
                <div className="h-20 rounded-2xl bg-[#1d1d1d]" />
                <div className="h-20 rounded-2xl bg-[#1d1d1d]" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="mb-2 text-lg font-semibold text-[#f5f1e8]">3 more categories + detailed fixes inside</p>
                <p className="mb-4 text-sm text-[#9f9888]">SEO, Design, Conversion, Performance, Trust & more</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(`/login?reportId=${preview.id}`)}
                className="flex-1 rounded-2xl bg-[#e4b63b] px-6 py-4 text-lg font-semibold text-[#111111] shadow-[0_14px_30px_rgba(228,182,59,0.16)] hover:bg-[#f5c74d]"
              >
                Unlock Full Report &mdash; $29
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="flex-1 rounded-2xl border border-[#5f4b19] bg-[#17140e] px-6 py-4 text-lg font-semibold text-[#f5c74d] hover:border-[#e4b63b] hover:bg-[#211a0f]"
              >
                Go Unlimited &mdash; $99/mo
              </button>
            </div>

            <button
              onClick={handleClearPreview}
              className="mt-4 w-full text-center text-sm text-[#7f7767] hover:text-[#d4cfc1]"
            >
              Roast a different site
            </button>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Paste Your URL", desc: "Enter any website URL and hit Roast My Site." },
            { step: "2", title: "Get Roasted", desc: "Our AI analyzes your site across 6 categories and delivers a witty, actionable audit." },
            { step: "3", title: "Fix & Grow", desc: "Follow the prioritized recommendations to improve your site and win more customers." },
          ].map((item) => (
            <div key={item.step} className="rounded-[28px] border border-[#2b2619] bg-[#141414] px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e4b63b] text-xl font-bold text-[#111111]">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-[#9f9888]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="rounded-[28px] border border-[#2b2619] bg-[#141414] p-8">
            <h3 className="text-xl font-semibold text-[#f5f1e8]">Single Report</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold text-[#f5c74d]">$29</span>
              <span className="ml-2 text-[#8e8573]">one-time</span>
            </div>
            <ul className="mt-6 space-y-3 text-[#d4cfc1]">
              <li>Full 6-category audit</li>
              <li>Downloadable PDF report</li>
              <li>Shareable report link</li>
            </ul>
          </div>
          <div className="rounded-[28px] border border-[#5c4613] bg-[#171511] p-8 ring-1 ring-[rgba(228,182,59,0.24)]">
            <span className="mb-4 inline-block rounded-full border border-[#5c4613] bg-[#211a0f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c74d]">Best Value</span>
            <h3 className="text-xl font-semibold text-[#f5f1e8]">Unlimited</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold text-[#f5c74d]">$99</span>
              <span className="ml-2 text-[#8e8573]">/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-[#d4cfc1]">
              <li>Unlimited roasts</li>
              <li>Re-run audits to track progress</li>
              <li>Report history dashboard</li>
              <li>PDF downloads on all reports</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">FAQ</h2>
        <div className="space-y-6">
          {[
            { q: "What exactly do you analyze?", a: "We audit 6 areas: First Impressions, SEO Health, Conversion Copy, Design & UX, Technical Performance, and Trust & Credibility. Each gets a score, a roast, and specific action items." },
            { q: "How long does it take?", a: "About 30-60 seconds. We run a real Lighthouse audit and AI analysis in parallel to keep it fast." },
            { q: "Can I share my report?", a: "Yes! Every paid report gets a unique shareable link. Great for showing your team or flexing a high score." },
            { q: "Is the roast actually useful?", a: "Absolutely. Every joke comes with a real, actionable finding. Think of it as a code review with personality." },
            { q: "Can I roast a competitor's site?", a: "We won't tell if you don't." },
          ].map((item, i) => (
            <div key={i} className="border-b border-[#2b2619] pb-6">
              <h3 className="text-lg font-semibold">{item.q}</h3>
              <p className="mt-2 text-[#9f9888]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
