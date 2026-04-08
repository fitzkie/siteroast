"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PricingCard } from "@/components/pricing-card";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  async function handleSubscribe() {
    if (!session?.user) { router.push("/login"); return; }
    const response = await fetch("/api/subscribe", { method: "POST" });
    const data = await response.json();
    if (data.checkoutUrl) { window.location.href = data.checkoutUrl; }
  }
  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f1e8]">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-[#4c3b13] bg-[#17140e] px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#f5c74d]">Pricing</span>
          <h1 className="mb-4 mt-6 text-4xl font-bold md:text-5xl">Choose the plan that fits your audit volume.</h1>
          <p className="mb-12 text-[#9f9888]">Every roast includes a six-category teardown, PDF export, and a shareable link your team can actually use.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PricingCard title="Single Report" price="$29" period="one-time"
            features={["Full 6-category audit", "Downloadable PDF report", "Shareable report link", "Embeddable score badge"]}
            ctaText="Get Started" onSelect={() => router.push("/")} />
          <PricingCard title="Unlimited" price="$99" period="/month"
            features={["Unlimited roasts", "Re-run audits to track progress", "Full report history dashboard", "PDF downloads on all reports", "Priority analysis queue"]}
            highlighted ctaText="Go Unlimited" onSelect={handleSubscribe} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
